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

export const inviteMemberSchema = z.object({
  email: z.string().email("E-mail inválido"),
  role: z.enum(["owner", "admin", "instructor", "student"]),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const addStudentSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(8, "Telefone inválido ou incompleto"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  city: z.string().optional(),
  neighborhoods: z.preprocess((val) => (val === undefined || val === null ? [] : val), z.array(z.string())).optional(),
  meetingPoints: z.preprocess((val) => (val === undefined || val === null ? [] : val), z.array(z.string())).optional(),
  categories: z.preprocess((val) => (val === undefined || val === null ? [] : val), z.array(z.string())).optional(),
  category: z.string().min(1, "Selecione uma categoria"),
  meetingPoint: z.string().min(1, "Informe um ponto de encontro"),
});

export type AddStudentInput = z.infer<typeof addStudentSchema>;

export const addClassSchema = z.object({
  studentId: z.string().min(1, "Aluno obrigatório"),
  studentName: z.string().min(3, "Nome do aluno obrigatório"),
  type: z.string().min(1, "Tipo de aula obrigatório"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  duration: z.string().min(1, "Duração é obrigatória"),
  meetingPoint: z.string().min(1, "Ponto de encontro é obrigatório"),
  studentPhoto: z.string().url("URL de foto inválida").optional(),
  instructorName: z.string().optional(),
});

export type AddClassInput = z.infer<typeof addClassSchema>;

export const instructorSettingsSchema = z.object({
  workDays: z.array(z.number().min(0).max(6)).nonempty(),
  workStart: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  workEnd: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  lunchStart: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  lunchEnd: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  city: z.string().min(1, "Cidade é obrigatória"),
  neighborhoods: z.array(z.string()).default([]),
  meetingPoints: z.array(z.string()).default([]),
  hourlyRate: z.number().nonnegative(),
  categories: z.array(z.string()).nonempty(),
  bio: z.string().optional(),
  classDuration: z.number().positive().optional(),
});

export type InstructorSettingsInput = z.infer<typeof instructorSettingsSchema>;

export const vehicleSchema = z.object({
  name: z.string().min(3, "Nome do veículo deve ter pelo menos 3 caracteres"),
  plate: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  brand: z.string().optional(),
  color: z.string().optional(),
  automatic: z.boolean().optional(),
  studentId: z.string().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const paymentSchema = z.object({
  studentId: z.string().min(1, "Aluno obrigatório"),
  amount: z.number().positive("O valor deve ser maior que zero"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

export const classRatingSchema = z.object({
  classSessionId: z.string().min(1, "Aula obrigatória"),
  rating: z.number().min(1, "Avaliação mínima de 1 estrela").max(5, "Avaliação máxima de 5 estrelas"),
  comment: z.string().max(500, "Comentário muito longo").optional(),
});

export type ClassRatingInput = z.infer<typeof classRatingSchema>;

