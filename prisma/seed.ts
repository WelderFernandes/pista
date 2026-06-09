import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Iniciando o seeding do banco de dados...");

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
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
    },
  });
  console.log(`Organização criada: ${org.name} (${org.id})`);

  // 3. Criar Usuário do Instrutor usando o Better Auth API para criptografar a senha corretamente
  // A senha será "Carlos123!"
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

  // 4. Associar o Instrutor à Organização como Owner (Membro administrativo)
  await prisma.member.create({
    data: {
      organizationId: org.id,
      userId: instructorUser.user.id,
      role: "owner",
    },
  });
  console.log("Instrutor associado como Owner da organização.");

  // 5. Criar Configurações do Instrutor para esta organização
  const settings = await prisma.instructorSettings.create({
    data: {
      id: org.id, // ID da configuração é igual ao ID da organização para o relacionamento 1-para-1
      organizationId: org.id,
      workDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
      workStart: "08:00",
      workEnd: "18:00",
      lunchStart: "12:00",
      lunchEnd: "13:30",
      city: "São Paulo",
      neighborhoods: ["Centro", "Pinheiros", "Vila Madalena", "Jardins"],
      meetingPoints: ["Centro Comercial", "Estação de Metrô Pinheiros", "Shopping Boulevard"],
      hourlyRate: 12000, // R$ 120,00 em centavos
      categories: ["B"],
      bio: "Instrutor credenciado com mais de 10 anos de experiência, especializado em direção defensiva e preparação para exames práticos.",
    },
  });
  console.log("Configurações do instrutor criadas.");

  // 6. Criar Estudantes (Students) vinculados à organização
  const student1 = await prisma.student.create({
    data: {
      id: "mariana-costa",
      organizationId: org.id,
      name: "Mariana Costa Silva",
      categories: ["B (Carro)"],
      progress: 60,
      completedClasses: 12,
      totalClasses: 20,
      photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcYC49gnQHyORIvqGwE3WVPlQpEEo_2rcGqxv90gPI0UL-8cHL1jE-hr08ErRhrGyaOCnzIXFAvAu-Y23apkm4mU1oFNL7XGlQDshIjte4e-Lljs0EI4uQuth6rnfe32x5z6CxN42rOxE8KXNzUYFI3snjUmmlRKrmnJcuudKc3zvyQjnucFGgtA4kirUs22QMw7vAxhLORKCV5VXRlncOvbKeBmzvUvv5aDZcE0PC8lm8h24k-G-2zb4RmOgHHpEpaLJaupvS-aY",
      pendingPayment: 15000, // R$ 150,00 em centavos
      meetingPoints: ["Centro"],
      phone: "(11) 98765-4321",
      city: "São Paulo",
      neighborhoods: ["Centro"],
    },
  });

  const student2 = await prisma.student.create({
    data: {
      id: "rafael-souza",
      organizationId: org.id,
      name: "Rafael Souza",
      categories: ["B (Carro)"],
      progress: 40,
      completedClasses: 8,
      totalClasses: 20,
      photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
      pendingPayment: 0,
      meetingPoints: ["Busca na Residência"],
      phone: "(11) 91234-5678",
      city: "São Paulo",
      neighborhoods: ["Pinheiros"],
    },
  });

  const student3 = await prisma.student.create({
    data: {
      id: "beatriz-lima",
      organizationId: org.id,
      name: "Beatriz Lima",
      categories: ["A (Moto)"],
      progress: 80,
      completedClasses: 16,
      totalClasses: 20,
      photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXI6m_H1FJGSYFqoFQmc2TkCWx-gBC6HiGsXCQUA8yrATa1IzKcZbryflfWubUVop34t_FPqEP1Cj-gU3lezS7CHv7nsQ_dkiu5A9VSNDcq8MtcfE8q_EpTNXfkTR7qy-UTYoT_k6vsLcnliZBqHfFDbwzIynUGp5j6OuHlsptpv4C3p6Am5FywHlkyEBgZfsDxMtI0ymOORILUOfRuReR7FDYw8R9BcnGrcDpeb9aaRd6yf19SkgyqmTrccyeItntzQeIGA3_fDc",
      pendingPayment: 32000, // R$ 320,00 em centavos
      meetingPoints: ["Pista de Treinamento"],
      phone: "(11) 99887-7665",
      city: "São Paulo",
      neighborhoods: ["Jardins"],
    },
  });

  console.log("Alunos de teste criados.");

  // 7. Criar Aulas (ClassSessions) vinculadas aos alunos e à organização
  await prisma.classSession.createMany({
    data: [
      {
        id: "class-1",
        organizationId: org.id,
        studentId: student1.id,
        studentName: student1.name,
        studentPhoto: student1.photoUrl,
        type: "Aula de Baliza",
        date: "2026-06-08",
        time: "14:00",
        duration: "14:00 - 15:40",
        meetingPoint: "Centro",
        status: "Confirmada",
        instructorName: "Carlos Eduardo",
      },
      {
        id: "class-2",
        organizationId: org.id,
        studentId: student2.id,
        studentName: student2.name,
        studentPhoto: student2.photoUrl,
        type: "Busca na Residência",
        date: "2026-06-08",
        time: "16:30",
        duration: "16:30 - 18:10",
        meetingPoint: "Residência do Aluno",
        status: "Pendente",
        instructorName: "Carlos Eduardo",
      },
      {
        id: "class-3",
        organizationId: org.id,
        studentId: student3.id,
        studentName: student3.name,
        studentPhoto: student3.photoUrl,
        type: "Prática de Baliza",
        date: "2026-06-08",
        time: "18:00",
        duration: "18:00 - 19:40",
        meetingPoint: "Pista de Treinamento",
        status: "Pendente",
        instructorName: "Carlos Eduardo",
      },
    ],
  });
  console.log("Aulas de teste criadas.");

  // 8. Criar Histórico de Transações (Transactions) vinculadas à organização
  await prisma.transaction.createMany({
    data: [
      {
        id: "t-1",
        organizationId: org.id,
        studentName: student1.name,
        amount: 15000, // R$ 150,00 em centavos
        type: "payment",
        date: "2026-06-05",
        status: "Recebido",
        description: "Pacote 10 Aulas Práticas (Parcela 1)",
      },
      {
        id: "t-2",
        organizationId: org.id,
        studentName: student3.name,
        amount: 32000, // R$ 320,00 em centavos
        type: "payment",
        date: "2026-06-04",
        status: "Pendente",
        description: "Taxa de Exame Prático Detran",
      },
      {
        id: "t-3",
        organizationId: org.id,
        studentName: student2.name,
        amount: 12000, // R$ 120,00 em centavos
        type: "payment",
        date: "2026-06-03",
        status: "Recebido",
        description: "Aula Avulsa de Direção",
      },
    ],
  });
  console.log("Transações financeiras de teste criadas.");

  console.log("Seeding completado com sucesso absoluto!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
