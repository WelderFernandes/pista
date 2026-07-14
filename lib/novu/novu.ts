import { Novu } from "@novu/api";

let novuInstance: Novu | null = null;

/**
 * Obtém a instância do cliente Novu de forma preguiçosa (lazy load),
 * permitindo que variáveis de ambiente sejam atribuídas dinamicamente.
 */
export function getNovuClient(): Novu | null {
  if (novuInstance) return novuInstance;

  const novuSecretKey = process.env.NOVU_SECRET_KEY;
  const novuApiUrl = process.env.NOVU_API_URL;
  if (novuSecretKey) {
    novuInstance = new Novu({
      secretKey: novuSecretKey,
      serverURL: novuApiUrl || undefined,
    });
    return novuInstance;
  }

  return null;
}

interface ClassSessionWithOrg {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  meetingPoint: string;
  instructorName: string;
  organizationId: string;
}

interface StudentData {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
}

/**
 * Dispara o workflow de lembrete de aula no Novu.
 */
export async function triggerClassReminder(session: ClassSessionWithOrg, student: StudentData) {
  const novu = getNovuClient();
  if (!novu) {
    console.warn("NOVU_SECRET_KEY is not set. Skipping Novu notification trigger.");
    return;
  }

  try {
    // Formata os valores de data e hora para criar um objeto Date
    const [year, month, day] = session.date.split("-").map(Number);
    const [hour, minute] = session.time.split(":").map(Number);
    const classDateTime = new Date(year, month - 1, day, hour, minute);

    // Sanitiza o número do telefone para o formato internacional com DDI 55 (Brasil)
    let phone = student.phone.replace(/\D/g, "");
    if (phone && !phone.startsWith("55")) {
      phone = `55${phone}`;
    }

    const payload = {
      studentName: student.name,
      classSubject: session.type,
      classDate: new Date(session.date + "T00:00:00").toLocaleDateString("pt-BR"),
      classTime: session.time,
      instructorName: session.instructorName,
      meetingPoint: session.meetingPoint,
      duration: session.duration,
      classStartDateTime: classDateTime.toISOString(), // Usado para o passo de Delay dinâmico no Novu dashboard
    };

    console.log(`[Novu] Disparando evento 'lembrete-aula-agendada' para o aluno ${student.name} (${student.id})`);

    const result = await novu.trigger({
      workflowId: "lembrete-aula-agendada",
      to: {
        subscriberId: student.id,
        firstName: student.name,
        phone: phone ? `+${phone}` : undefined,
        email: student.email || undefined,
      },
      payload: payload,
      transactionId: `session_${session.id}`,
    });

    console.log(`[Novu] Resposta do trigger:`, result);
    return result;
  } catch (error) {
    console.error("Erro ao disparar notificação via Novu:", error);
  }
}

/**
 * Cancela um lembrete agendado no Novu (caso a aula seja cancelada, deletada ou editada).
 */
export async function cancelClassReminder(sessionId: string) {
  const novu = getNovuClient();
  if (!novu) return;

  try {
    console.log(`[Novu] Cancelando evento programado para a aula ${sessionId}`);
    const result = await novu.cancel(`session_${sessionId}`);
    console.log(`[Novu] Cancelamento concluído:`, result);
    return result;
  } catch (error) {
    console.error("Erro ao cancelar notificação no Novu:", error);
  }
}

/**
 * Dispara o workflow de boas-vindas para o instrutor/membro.
 */
export async function triggerWelcomeNotification(user: { id: string; name: string; email: string }) {
  const novu = getNovuClient();
  if (!novu) {
    console.warn("NOVU_SECRET_KEY is not set. Skipping Novu welcome trigger.");
    return;
  }

  try {
    console.log(`[Novu] Disparando evento 'bem-vindo' para o instrutor ${user.name} (${user.id})`);

    const result = await novu.trigger({
      workflowId: "bem-vindo",
      to: {
        subscriberId: user.id,
        firstName: user.name,
        email: user.email,
      },
      payload: {
        name: user.name,
        email: user.email,
      },
    });

    console.log(`[Novu] Resposta do trigger bem-vindo:`, result);
    return result;
  } catch (error) {
    console.error("Erro ao disparar notificação bem-vindo via Novu:", error);
  }
}
