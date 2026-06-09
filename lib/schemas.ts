import { z } from "zod";

export const publicBookingSchema = z.object({
  organizationId: z.string(),
  studentName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  studentPhone: z.string().min(10, "Telefone de WhatsApp inválido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  duration: z.string().min(1, "Duração é obrigatória"),
  meetingPoint: z.string().min(1, "Ponto de encontro é obrigatório"),
  type: z.string().min(1, "Categoria é obrigatória"),
  instructorName: z.string().min(1, "Nome do instrutor é obrigatório"),
});

export type PublicBookingData = z.infer<typeof publicBookingSchema>;
