"use server";

import { requireTenant } from "@/lib/auth-helpers";
import { getTenantPrisma, prisma } from "@/lib/prisma";
import { Student, ClassSession, Transaction, InstructorSettings } from "@/lib/store";
import { publicBookingSchema, type PublicBookingData } from "@/lib/schemas";



/**
 * Obtém todos os dados do banco de dados filtrados pelo tenant (organização ativa)
 * do usuário logado na requisição atual.
 */
export async function getAppData() {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  const [students, classes, transactions, dbSettings] = await Promise.all([
    tenantPrisma.student.findMany({
      orderBy: { name: "asc" },
    }),
    tenantPrisma.classSession.findMany({
      orderBy: { date: "desc" },
    }),
    tenantPrisma.transaction.findMany({
      orderBy: { date: "desc" },
    }),
    tenantPrisma.instructorSettings.findUnique({
      where: { organizationId: activeOrgId },
    }),
  ]);

  // Se as configurações do instrutor não existirem para este tenant (como no registro de nova org), criamos a padrão
  let settings = dbSettings;
  if (!settings) {
    settings = await tenantPrisma.instructorSettings.create({
      data: {
        id: activeOrgId,
        organizationId: activeOrgId,
        workDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
        workStart: "08:00",
        workEnd: "18:00",
        lunchStart: "12:00",
        lunchEnd: "13:30",
        city: "São Paulo",
        neighborhoods: ["Centro"],
        meetingPoints: ["Centro Comercial"],
        hourlyRate: 12000, // R$ 120,00 em centavos
        categories: ["B"],
        bio: "Autoescola cadastrada com sucesso.",
      },
    });
  }

  const mappedStudents: Student[] = students.map((s: any) => ({
    ...s,
    category: s.categories?.[0] || "B (Carro)",
    meetingPoint: s.meetingPoints?.[0] || "Centro Comercial",
    email: `${s.id}@volantecerto.com`,
  }));

  return {
    students: mappedStudents,
    classes: classes as unknown as ClassSession[],
    transactions: transactions as unknown as Transaction[],
    settings: {
      ...settings,
      extraDays: [],
    } as unknown as InstructorSettings,
  };
}

/**
 * Cadastra um novo estudante no banco de dados associado ao tenant logado.
 */
export async function addStudentAction(
  data: Omit<Student, "id" | "progress" | "completedClasses" | "totalClasses" | "photoUrl">
) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  const id = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

  return await tenantPrisma.student.create({
    data: {
      id,
      organizationId: activeOrgId,
      name: data.name,
      phone: data.phone,
      city: data.city || "São Paulo",
      neighborhoods: data.neighborhoods || [data.meetingPoint],
      meetingPoints: data.meetingPoints || [data.meetingPoint],
      categories: data.categories || [data.category],
      photoUrl: `https://xsgames.co/randomusers/assets/avatars/female/${Math.floor(Math.random() * 50) + 1}.jpg`,
      pendingPayment: 0,
      progress: 0,
      completedClasses: 0,
      totalClasses: 20,
    },
  });
}

/**
 * Adiciona um agendamento de aula no banco de dados associado ao tenant logado.
 */
export async function addClassAction(
  data: Omit<ClassSession, "id" | "status" | "studentPhoto" | "instructorName"> & {
    studentPhoto?: string;
    instructorName?: string;
  }
) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.classSession.create({
    data: {
      studentId: data.studentId,
      organizationId: activeOrgId,
      studentName: data.studentName,
      studentPhoto:
        data.studentPhoto ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80",
      type: data.type,
      date: data.date,
      time: data.time,
      duration: data.duration,
      meetingPoint: data.meetingPoint,
      status: "Pendente",
      instructorName: data.instructorName || "Carlos Eduardo",
    },
  });
}

/**
 * Confirma uma aula no banco de dados.
 */
export async function confirmClassAction(classId: string) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.classSession.update({
    where: { id: classId },
    data: { status: "Confirmada" },
  });
}

/**
 * Inicia a aula, alterando seu status para "Em andamento".
 */
export async function startClassAction(classId: string) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.classSession.update({
    where: { id: classId },
    data: { status: "Em andamento" },
  });
}

/**
 * Cancela uma aula.
 */
export async function cancelClassAction(classId: string) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.classSession.update({
    where: { id: classId },
    data: { status: "Cancelada" },
  });
}

/**
 * Conclui uma aula prática, incrementando atômica e transacionalmente o progresso do estudante.
 */
export async function completeClassAction(classId: string) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.$transaction(async (tx) => {
    const session = await tx.classSession.update({
      where: { id: classId },
      data: { status: "Concluída" },
    });

    const student = await tx.student.findUnique({
      where: { id: session.studentId },
    });

    if (student) {
      const completed = Math.min(student.completedClasses + 1, student.totalClasses);
      const progress = Math.round((completed / student.totalClasses) * 100);

      await tx.student.update({
        where: { id: session.studentId },
        data: {
          completedClasses: completed,
          progress,
        },
      });
    }

    return session;
  });
}

/**
 * Efetua o recebimento de pagamento de uma fatura pendente de aluno.
 * Deduz o valor do saldo pendente do estudante e cria a transação de entrada correspondente.
 */
export async function payPendingPaymentAction(studentId: string, amount: number) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error("Estudante não encontrado.");
    }

    // Cria a transação do tipo pagamento
    const transaction = await tx.transaction.create({
      data: {
        studentName: student.name,
        organizationId: activeOrgId,
        amount,
        type: "payment",
        date: new Date().toISOString().split("T")[0],
        status: "Recebido",
        description: "Pagamento de Fatura Pendente (PIX)",
      },
    });

    // Deduz o débito do aluno no banco de dados
    await tx.student.update({
      where: { id: studentId },
      data: {
        pendingPayment: {
          decrement: amount,
        },
      },
    });

    return transaction;
  });
}

/**
 * Atualiza as configurações administrativas da autoescola no banco de dados.
 */
export async function updateSettingsAction(data: InstructorSettings) {
  const { activeOrgId } = await requireTenant();
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.instructorSettings.update({
    where: { organizationId: activeOrgId },
    data: {
      workDays: data.workDays,
      workStart: data.workStart,
      workEnd: data.workEnd,
      lunchStart: data.lunchStart,
      lunchEnd: data.lunchEnd,
      city: data.city,
      neighborhoods: data.neighborhoods,
      meetingPoints: data.meetingPoints,
      hourlyRate: data.hourlyRate,
      categories: data.categories,
      bio: data.bio || "",
    },
  });
}

export async function getPublicInstructors() {
  const settingsList = await prisma.instructorSettings.findMany({
    include: {
      organization: {
        select: {
          name: true,
          logo: true,
          classes: {
            where: {
              status: { not: "Cancelada" },
            },
            select: {
              date: true,
              time: true,
              instructorName: true,
            },
          },
        },
      },
    },
  });

  return settingsList.map((settings) => ({
    id: settings.organizationId,
    name: settings.organization.name,
    photo: settings.organization.logo || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=120&h=120&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 38,
    city: settings.city,
    neighborhoods: settings.neighborhoods,
    meetingPoints: settings.meetingPoints,
    hourlyRate: settings.hourlyRate,
    categories: settings.categories,
    bio: settings.bio,
    distance: 2.4,
    workDays: settings.workDays,
    workStart: settings.workStart,
    workEnd: settings.workEnd,
    lunchStart: settings.lunchStart,
    lunchEnd: settings.lunchEnd,
    classes: settings.organization.classes,
  }));
}
/**
 * Adiciona um agendamento de aula pública de visitante anônimo.
 * Cria o estudante caso não exista na organização.
 */
export async function addPublicClassAction(rawData: PublicBookingData) {
  const data = publicBookingSchema.parse(rawData);

  // Sanitiza o telefone para criar um ID único coerente
  const sanitizedPhone = data.studentPhone.replace(/\D/g, "");
  const studentId = `guest-${sanitizedPhone}`;

  // Tenta localizar ou criar o estudante correspondente nessa organização
  let student = await prisma.student.findFirst({
    where: {
      id: studentId,
      organizationId: data.organizationId,
    },
  });

  if (!student) {
    student = await prisma.student.create({
      data: {
        id: studentId,
        organizationId: data.organizationId,
        name: data.studentName,
        phone: data.studentPhone,
        city: data.meetingPoint,
        neighborhoods: [data.meetingPoint],
        meetingPoints: [data.meetingPoint],
        categories: [data.type.replace("Aula Prática (Cat. ", "").replace(")", "")],
        photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
        progress: 0,
        completedClasses: 0,
        totalClasses: 20,
        pendingPayment: 0,
      },
    });
  }

  // Cria a ClassSession
  return await prisma.classSession.create({
    data: {
      organizationId: data.organizationId,
      studentId: student.id,
      studentName: data.studentName,
      studentPhoto: student.photoUrl,
      type: data.type,
      date: data.date,
      time: data.time,
      duration: data.duration,
      meetingPoint: data.meetingPoint,
      instructorName: data.instructorName,
      status: "Pendente",
    },
  });
}


