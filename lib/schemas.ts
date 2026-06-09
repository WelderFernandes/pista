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

export const signUpSchema = z.object({
  name: z.string().min(3, "O nome completo deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["instructor", "student"]),
  orgName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === "instructor" && (!data.orgName || data.orgName.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "O nome da autoescola é obrigatório para instrutores",
  path: ["orgName"],
});

export type SignUpInput = z.infer<typeof signUpSchema>;

