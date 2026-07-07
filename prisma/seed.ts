import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { fakerPT_BR as faker } from "@faker-js/faker";

async function main() {
  console.log("Iniciando o seeding com dados realistas gerados pelo Faker JS...");

  // Configura um seed fixo para consistência nas execuções consecutivas se necessário
  faker.seed(42);

  // 1. Limpar dados antigos por segurança
  await prisma.transaction.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.student.deleteMany();
  await prisma.instructorSettings.deleteMany();
  await prisma.member.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log("Banco de dados limpo com sucesso.");

  // 2. Criar a Organização Padrão (Tenant)
  const org = await prisma.organization.create({
    data: {
      name: "Autoescola Volante Certo",
      slug: "volante-certo",
      logo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=120&h=120&fit=crop&q=80",
    },
  });
  console.log(`Organização criada: ${org.name} (${org.id})`);

  // 3. Criar Usuário do Instrutor usando o Better Auth API
  // A senha será "SenhaSegura123"
  const instructorUser = await auth.api.signUpEmail({
    body: {
      email: "carlos@volantecerto.com",
      password: "SenhaSegura123",
      name: "Carlos Eduardo",
    },
  });

  if (!instructorUser) {
    throw new Error("Falha ao criar o usuário do instrutor via Better Auth.");
  }

  console.log(`Usuário do Instrutor criado: ${instructorUser.user.name}`);

  // 3.1. Criar Usuário da Aluna Mariana usando o Better Auth API
  const studentUser = await auth.api.signUpEmail({
    body: {
      email: "mariana@volantecerto.com",
      password: "SenhaSegura123",
      name: "Mariana Costa Silva",
    },
  });

  if (!studentUser) {
    throw new Error("Falha ao criar o usuário do estudante via Better Auth.");
  }

  console.log(`Usuário do Estudante criado: ${studentUser.user.name}`);

  // 4. Associar o Instrutor à Organização como Owner
  await prisma.member.create({
    data: {
      organizationId: org.id,
      userId: instructorUser.user.id,
      role: "owner",
    },
  });
  console.log("Instrutor associado como Owner da organização.");

  // 4.1. Associar a Aluna Mariana à Organização como Student
  await prisma.member.create({
    data: {
      organizationId: org.id,
      userId: studentUser.user.id,
      role: "student",
    },
  });
  console.log("Estudante associada como Student da organização.");

  // 5. Criar Configurações do Instrutor para esta organização
  await prisma.instructorSettings.create({
    data: {
      id: org.id,
      organizationId: org.id,
      workDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
      workStart: "08:00",
      workEnd: "18:00",
      lunchStart: "12:00",
      lunchEnd: "13:30",
      city: "São Paulo",
      neighborhoods: ["Centro", "Pinheiros", "Vila Madalena", "Jardins", "Butantã", "Perdizes"],
      meetingPoints: ["Centro Comercial", "Estação de Metrô Pinheiros", "Shopping Boulevard", "Praça Panamericana"],
      hourlyRate: 12000, // R$ 120,00 em centavos
      categories: ["A", "B"],
      bio: "Instrutor credenciado com mais de 10 anos de experiência, especializado em direção defensiva e preparação para exames práticos.",
    },
  });
  console.log("Configurações do instrutor criadas.");

  // 6. Alunos Principais e Fixos para não quebrar testes de frontend
  const fixedStudentsData = [
    {
      id: "mariana-costa",
      userId: studentUser.user.id,
      name: "Mariana Costa Silva",
      email: "mariana@volantecerto.com",
      categories: ["B (Carro)"],
      progress: 60,
      completedClasses: 12,
      totalClasses: 20,
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80",
      pendingPayment: 15000, // R$ 150,00 em centavos
      meetingPoints: ["Centro"],
      phone: "(11) 98765-4321",
      city: "São Paulo",
      neighborhoods: ["Centro"],
    },
    {
      id: "rafael-souza",
      name: "Rafael Souza",
      email: "rafael@volantecerto.com",
      categories: ["B (Carro)"],
      progress: 40,
      completedClasses: 8,
      totalClasses: 20,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
      pendingPayment: 0,
      meetingPoints: ["Busca na Residência"],
      phone: "(11) 91234-5678",
      city: "São Paulo",
      neighborhoods: ["Pinheiros"],
    },
    {
      id: "beatriz-lima",
      name: "Beatriz Lima",
      email: "beatriz@volantecerto.com",
      categories: ["A (Moto)"],
      progress: 80,
      completedClasses: 16,
      totalClasses: 20,
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80",
      pendingPayment: 32000, // R$ 320,00 em centavos
      meetingPoints: ["Pista de Treinamento"],
      phone: "(11) 99887-7665",
      city: "São Paulo",
      neighborhoods: ["Jardins"],
    },
  ];

  const students = [];

  // Salvar os alunos fixos
  for (const item of fixedStudentsData) {
    const student = await prisma.student.create({
      data: {
        ...item,
        organizationId: org.id,
      },
    });
    students.push(student);
  }

  // Gerar mais 12 alunos fictícios com o Faker
  const totalFakerStudents = 12;
  const categoriesList = [["A (Moto)"], ["B (Carro)"], ["A (Moto)", "B (Carro)"]];
  const meetingPointsList = ["Centro Comercial", "Estação de Metrô Pinheiros", "Shopping Boulevard", "Busca na Residência"];
  const neighborhoodsList = ["Centro", "Pinheiros", "Vila Madalena", "Jardins", "Butantã", "Perdizes"];

  for (let i = 0; i < totalFakerStudents; i++) {
    const name = faker.person.fullName();
    const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
    
    // Gerar foto baseada em gênero fictício
    const isMale = faker.datatype.boolean();
    const photoId = faker.number.int({ min: 1, max: 70 });
    const photoUrl = isMale 
      ? `https://xsgames.co/randomusers/assets/avatars/male/${photoId}.jpg`
      : `https://xsgames.co/randomusers/assets/avatars/female/${photoId}.jpg`;

    const totalClasses = faker.helpers.arrayElement([20, 25, 30]);
    const completedClasses = faker.number.int({ min: 2, max: totalClasses - 2 });
    const progress = Math.round((completedClasses / totalClasses) * 100);

    const student = await prisma.student.create({
      data: {
        id,
        organizationId: org.id,
        name,
        phone: `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        email: `${id}@volantecerto.com`,
        city: "São Paulo",
        neighborhoods: [faker.helpers.arrayElement(neighborhoodsList)],
        meetingPoints: [faker.helpers.arrayElement(meetingPointsList)],
        categories: faker.helpers.arrayElement(categoriesList),
        photoUrl,
        progress,
        completedClasses,
        totalClasses,
        pendingPayment: faker.helpers.arrayElement([0, 0, 12000, 24000, 48000]), // R$0, R$120 ou R$240 ou R$480
      },
    });
    students.push(student);
  }

  console.log(`Total de ${students.length} alunos cadastrados com sucesso.`);

  // 7. Gerar Aulas (ClassSessions) com Faker
  const classTypes = ["Aula de Baliza", "Prática de Direção", "Percurso de Exame", "Treinamento em Rodovia"];
  const hoursList = ["08:00", "09:40", "11:20", "14:00", "15:40", "17:20"];
  const statuses = ["Confirmada", "Pendente", "Concluída", "Cancelada"];

  const classesToCreate = [];

  // Criar 30 aulas distribuídas
  for (let i = 0; i < 40; i++) {
    const student = faker.helpers.arrayElement(students);
    const date = faker.date.between({
      from: new Date("2026-05-15T00:00:00.000Z"),
      to: new Date("2026-06-25T00:00:00.000Z"),
    });

    const formattedDate = date.toISOString().split("T")[0];
    const time = faker.helpers.arrayElement(hoursList);
    
    // Calcula fim da aula (exemplo: 1h40m de duração padrão)
    const [h, m] = time.split(":").map(Number);
    let endH = h + 1;
    let endM = m + 40;
    if (endM >= 60) {
      endH += 1;
      endM -= 60;
    }
    const duration = `${time} - ${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

    classesToCreate.push({
      organizationId: org.id,
      studentId: student.id,
      studentName: student.name,
      studentPhoto: student.photoUrl,
      type: faker.helpers.arrayElement(classTypes),
      date: formattedDate,
      time,
      duration,
      meetingPoint: student.meetingPoints[0],
      status: faker.helpers.arrayElement(statuses),
      instructorName: "Carlos Eduardo",
    });
  }

  await prisma.classSession.createMany({
    data: classesToCreate,
  });
  console.log("40 Aulas práticas de teste criadas.");

  // 8. Gerar Transações Financeiras (Transactions) com Faker
  const transactionsToCreate = [];

  // Gerar 25 pagamentos recebidos ou pendentes
  for (let i = 0; i < 25; i++) {
    const student = faker.helpers.arrayElement(students);
    const amount = faker.helpers.arrayElement([12000, 15000, 24000, 32000, 48000]); // em centavos
    const isPayment = faker.datatype.boolean(0.85); // 85% são entradas financeiras (pagamentos de alunos)

    const date = faker.date.between({
      from: new Date("2026-05-01T00:00:00.000Z"),
      to: new Date("2026-06-08T00:00:00.000Z"),
    });

    if (isPayment) {
      transactionsToCreate.push({
        organizationId: org.id,
        studentName: student.name,
        amount,
        type: "payment",
        date: date.toISOString().split("T")[0],
        status: faker.helpers.arrayElement(["Recebido", "Pendente"]),
        description: faker.helpers.arrayElement([
          "Pacote de Aulas Práticas",
          "Taxa de Exame Prático Detran",
          "Aula Avulsa de Direção",
          "Simulado de Baliza",
        ]),
      });
    } else {
      // Despesa (expense)
      transactionsToCreate.push({
        organizationId: org.id,
        studentName: "Fornecedores Diversos",
        amount: faker.number.int({ min: 5000, max: 25000 }), // despesa de R$ 50 a R$ 250 em centavos
        type: "expense",
        date: date.toISOString().split("T")[0],
        status: "Recebido",
        description: faker.helpers.arrayElement([
          "Abastecimento Veículo de Treino",
          "Manutenção e Higienização de Frota",
          "Renovação de Taxas do CFC",
          "Material de Escritório",
        ]),
      });
    }
  }

  await prisma.transaction.createMany({
    data: transactionsToCreate,
  });
  console.log("25 Transações de teste de fluxo de caixa criadas.");

  console.log("Seeding com Faker JS completado com sucesso absoluto!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
