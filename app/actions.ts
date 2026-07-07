"use server";

import { getActiveMember, requireRole, requireTenant } from "@/lib/auth-helpers";
import { getTenantPrisma, prisma } from "@/lib/prisma";
import { Student, ClassSession, Transaction, InstructorSettings, Vehicle } from "@/lib/store";
import { publicBookingSchema, type PublicBookingData } from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Obtém todos os dados do banco de dados filtrados pelo tenant (organização ativa)
 * do usuário logado na requisição atual, aplicando regras de controle de acesso (RBAC).
 */
export async function getAppData() {
  const memberInfo = await getActiveMember();
  if (!memberInfo) {
    throw new Error("Não autenticado.");
  }

  let activeOrgId = memberInfo.activeOrgId;

  // Verifica se a organização ativa realmente existe no banco de dados (evita erros de cookie dessincronizado)
  if (activeOrgId) {
    const orgExists = await prisma.organization.findUnique({
      where: { id: activeOrgId },
    });
    if (!orgExists) {
      activeOrgId = null;
    }
  }

  // Se o usuário não possui uma organização ativa na sessão, tentamos vinculá-lo via e-mail do estudante
  if (!activeOrgId) {
    const matchedStudent = await prisma.student.findFirst({
      where: {
        email: memberInfo.user.email,
      },
    });

    if (matchedStudent) {
      activeOrgId = matchedStudent.organizationId;

      // Cria a associação de membro com a role 'student'
      await prisma.member.upsert({
        where: {
          id: `${memberInfo.user.id}-${activeOrgId}`,
        },
        create: {
          id: `${memberInfo.user.id}-${activeOrgId}`,
          organizationId: activeOrgId,
          userId: memberInfo.user.id,
          role: "student",
        },
        update: {},
      });
    } else {
      throw new Error("Nenhuma organização vinculada a este usuário. Cadastre-se utilizando um convite ou e-mail registrado pelo instrutor.");
    }
  }

  // Vincula o usuário logado ao estudante cadastrado pelo instrutor se houver correspondência pelo e-mail ou userId
  const existingStudent = await prisma.student.findFirst({
    where: {
      OR: [
        { userId: memberInfo.user.id },
        { email: memberInfo.user.email }
      ]
    }
  });

  if (existingStudent && !existingStudent.userId) {
    await prisma.student.update({
      where: { id: existingStudent.id },
      data: { userId: memberInfo.user.id }
    });
  }

  const tenantPrisma = getTenantPrisma(activeOrgId);

  // Busca configurações do instrutor/autoescola
  const dbSettings = await tenantPrisma.instructorSettings.findUnique({
    where: { organizationId: activeOrgId },
  });

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
        hourlyRate: 12000,
        categories: ["B"],
        bio: "Autoescola cadastrada com sucesso.",
      },
    });
  }

  const userRole = memberInfo.role || "student";
  let studentsData: any[] = [];
  let classesData: any[] = [];
  let transactionsData: any[] = [];

  if (userRole === "student") {
    // Se o usuário logado é um aluno, ele visualiza apenas os seus próprios dados
    studentsData = await tenantPrisma.student.findMany({
      where: {
        userId: memberInfo.user.id,
      },
    });

    if (studentsData.length === 0 && existingStudent) {
      studentsData = [
        await tenantPrisma.student.findUnique({
          where: { id: existingStudent.id },
        }) as any
      ];
    }

    const studentId = studentsData[0]?.id || "";
    classesData = await tenantPrisma.classSession.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: { date: "desc" },
    });

    // Transações financeiras não são visíveis para alunos
    transactionsData = [];
  } else {
    // Instrutores e donos visualizam todos os estudantes, aulas e transações financeiras
    studentsData = await tenantPrisma.student.findMany({
      orderBy: { name: "asc" },
    });
    classesData = await tenantPrisma.classSession.findMany({
      orderBy: { date: "desc" },
    });
    transactionsData = await tenantPrisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
  }

  const mappedStudents: Student[] = studentsData.filter(Boolean).map((s: any) => ({
    ...s,
    category: s.categories?.[0] || "B (Carro)",
    meetingPoint: s.meetingPoints?.[0] || "Centro Comercial",
    email: `${s.id}@volantecerto.com`,
  }));

  const vehiclesData = await tenantPrisma.vehicle.findMany({
    orderBy: { name: "asc" },
  });

  return {
    students: mappedStudents,
    classes: classesData as unknown as ClassSession[],
    transactions: transactionsData as unknown as Transaction[],
    settings: settings as unknown as InstructorSettings,
    vehicles: vehiclesData as unknown as Vehicle[],
  };
}

/**
 * Cadastra um novo estudante no banco de dados associado ao tenant logado.
 */
export async function addStudentAction(
  data: Omit<Student, "id" | "progress" | "completedClasses" | "totalClasses" | "photoUrl">
) {
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
  const tenantPrisma = getTenantPrisma(activeOrgId);

  const id = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

  return await tenantPrisma.student.create({
    data: {
      id,
      organizationId: activeOrgId,
      name: data.name,
      phone: data.phone,
      email: data.email,
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
  const memberInfo = await requireRole(["owner", "admin", "instructor", "student"]);
  const tenantPrisma = getTenantPrisma(memberInfo.activeOrgId);

  // Se for estudante, garante que ele só pode agendar aula para si mesmo
  if (memberInfo.role === "student") {
    const student = await tenantPrisma.student.findFirst({
      where: { userId: memberInfo.user.id },
    });
    if (!student || data.studentId !== student.id) {
      throw new Error("Não autorizado.");
    }
  }

  return await tenantPrisma.classSession.create({
    data: {
      studentId: data.studentId,
      organizationId: memberInfo.activeOrgId,
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
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
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
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
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
  const memberInfo = await requireRole(["owner", "admin", "instructor", "student"]);
  const tenantPrisma = getTenantPrisma(memberInfo.activeOrgId);

  // Se for estudante, garante que ele só pode cancelar suas próprias aulas
  if (memberInfo.role === "student") {
    const classSession = await tenantPrisma.classSession.findUnique({
      where: { id: classId },
    });
    const student = await tenantPrisma.student.findFirst({
      where: { userId: memberInfo.user.id },
    });
    if (!classSession || !student || classSession.studentId !== student.id) {
      throw new Error("Não autorizado.");
    }
  }

  return await tenantPrisma.classSession.update({
    where: { id: classId },
    data: { status: "Cancelada" },
  });
}

/**
 * Conclui uma aula prática, incrementando atômica e transacionalmente o progresso do estudante.
 */
export async function completeClassAction(classId: string) {
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.$transaction(async (tx: any) => {
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
  const memberInfo = await requireRole(["owner", "admin", "instructor", "student"]);
  const tenantPrisma = getTenantPrisma(memberInfo.activeOrgId);

  if (amount <= 0) {
    throw new Error("O valor do pagamento deve ser maior que zero.");
  }

  // Se for estudante, garante que ele só pode pagar sua própria fatura
  if (memberInfo.role === "student") {
    const student = await tenantPrisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student || student.userId !== memberInfo.user.id) {
      throw new Error("Não autorizado.");
    }
  }

  return await tenantPrisma.$transaction(async (tx: any) => {
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
        organizationId: memberInfo.activeOrgId,
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
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.instructorSettings.upsert({
    where: { organizationId: activeOrgId },
    create: {
      id: activeOrgId,
      organizationId: activeOrgId,
      workDays: data.workDays || [1, 2, 3, 4, 5, 6],
      workStart: data.workStart || "08:00",
      workEnd: data.workEnd || "18:00",
      lunchStart: data.lunchStart || "12:00",
      lunchEnd: data.lunchEnd || "13:30",
      city: data.city,
      neighborhoods: data.neighborhoods,
      meetingPoints: data.meetingPoints,
      hourlyRate: data.hourlyRate,
      categories: data.categories,
      bio: data.bio || "",
    },
    update: {
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

  return settingsList.map((settings: any) => ({
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

/**
 * Envia um convite de membro com papel definido para a organização ativa do usuário.
 */
export async function inviteMemberAction(email: string, role: string) {
  const { activeOrgId, user } = await requireRole(["owner", "admin"]);
  
  return await prisma.invitation.create({
    data: {
      organizationId: activeOrgId,
      email: email.toLowerCase(),
      role: role,
      status: "pending",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
      inviterId: user.id,
    },
  });
}

/**
 * Obtém todos os membros (equipe) ativos da organização ativa.
 */
export async function getTeamMembersAction() {
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
  
  return await prisma.member.findMany({
    where: {
      organizationId: activeOrgId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      role: "asc",
    },
  });
}

/**
 * Obtém todos os convites pendentes da organização ativa.
 */
export async function getPendingInvitationsAction() {
  const { activeOrgId } = await requireRole(["owner", "admin"]);
  
  return await prisma.invitation.findMany({
    where: {
      organizationId: activeOrgId,
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Obtém os detalhes de um convite a partir de seu ID/token.
 */
export async function getInvitationDetailsAction(invitationId: string) {
  return await prisma.invitation.findUnique({
    where: {
      id: invitationId,
    },
    include: {
      organization: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });
}

/**
 * Aceita um convite e associa o usuário atual à organização correspondente.
 */
export async function acceptInvitationAction(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Não autenticado.");
  }

  const invitation = await prisma.invitation.findUnique({
    where: {
      id: invitationId,
    },
  });

  if (!invitation || invitation.status !== "pending") {
    throw new Error("Convite inválido ou expirado.");
  }

  // Atualiza status do convite
  await prisma.invitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: "accepted",
    },
  });

  // Cria o membro na organização
  const memberId = `${session.user.id}-${invitation.organizationId}`;
  const member = await prisma.member.upsert({
    where: {
      id: memberId,
    },
    create: {
      id: memberId,
      organizationId: invitation.organizationId,
      userId: session.user.id,
      role: invitation.role,
    },
    update: {
      role: invitation.role,
    },
  });

  // Atualiza a sessão definindo a organização ativa
  await auth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId: invitation.organizationId,
    },
  });

  return member;
}

/**
 * Cria ou atualiza as configurações detalhadas do instrutor/autoescola no momento do cadastro.
 */
export async function createInstructorSettingsAction(orgId: string, data: {
  workDays?: number[];
  workStart?: string;
  workEnd?: string;
  lunchStart?: string;
  lunchEnd?: string;
  city: string;
  neighborhoods: string[];
  meetingPoints: string[];
  hourlyRate: number;
  categories: string[];
  bio: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Não autenticado.");
  }

  // Verifica se o usuário é membro da organização
  const member = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: orgId,
    },
  });
  if (!member) {
    throw new Error("Não autorizado.");
  }

  const tenantPrisma = getTenantPrisma(orgId);
  return await tenantPrisma.instructorSettings.upsert({
    where: { organizationId: orgId },
    create: {
      id: orgId,
      organizationId: orgId,
      workDays: data.workDays || [1, 2, 3, 4, 5, 6],
      workStart: data.workStart || "08:00",
      workEnd: data.workEnd || "18:00",
      lunchStart: data.lunchStart || "12:00",
      lunchEnd: data.lunchEnd || "13:30",
      city: data.city,
      neighborhoods: data.neighborhoods,
      meetingPoints: data.meetingPoints,
      hourlyRate: data.hourlyRate,
      categories: data.categories,
      bio: data.bio || "",
    },
    update: {
      city: data.city,
      neighborhoods: data.neighborhoods,
      meetingPoints: data.meetingPoints,
      hourlyRate: data.hourlyRate,
      categories: data.categories,
      bio: data.bio || "",
    },
  });
}

/**
 * Adiciona um veículo ao banco de dados associado ao tenant logado.
 */
export async function addVehicleAction(data: Omit<Vehicle, "id">) {
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.vehicle.create({
    data: {
      organizationId: activeOrgId,
      studentId: data.studentId || null,
      name: data.name,
      plate: data.plate || null,
      category: data.category,
      brand: data.brand || null,
      color: data.color || null,
    },
  });
}

/**
 * Remove um veículo do banco de dados.
 */
export async function deleteVehicleAction(id: string) {
  const { activeOrgId } = await requireRole(["owner", "admin", "instructor"]);
  const tenantPrisma = getTenantPrisma(activeOrgId);

  return await tenantPrisma.vehicle.delete({
    where: { id },
  });
}



