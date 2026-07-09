"use client";

export interface InstructorSettings  {
  id?: string;
  organizationId?: string;
  workDays: number[];
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  extraDays?: { date: string; start: string; end: string }[];
  city: string;
  neighborhoods: string[];
  meetingPoints: string[];
  hourlyRate: number;
  categories: string[];
  classDuration?: number;
  categoryPrices?: Record<string, number>;
  bio?: string;
  address?: Address;
}

export interface Address {
  id?: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  instructorSettingsId?: string;
}

export interface Student {
  id: string;
  organizationId?: string;
  userId?: string;
  name: string;
  phone: string;
  city?: string;
  neighborhoods?: string[];
  meetingPoints?: string[];
  categories?: string[];
  // Propriedades virtuais/compatibilidade com o frontend
  category: string;
  meetingPoint: string;
  email: string;
  photoUrl: string;
  progress: number;
  completedClasses: number;
  totalClasses: number;
  pendingPayment: number;
}

export interface ClassSession {
  id: string;
  organizationId?: string;
  studentId: string;
  studentName: string;
  studentPhoto: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  meetingPoint: string;
  status: "Confirmada" | "Pendente" | "Cancelada" | "Concluída" | "Em andamento";
  instructorName: string;
}

export interface Transaction {
  id: string;
  organizationId?: string;
  studentName: string;
  amount: number;
  type: "payment" | "expense";
  date: string;
  status: "Recebido" | "Pendente" | "Atrasado";
  description: string;
}

export interface Vehicle {
  id: string;
  organizationId?: string;
  studentId?: string;
  name: string;
  plate?: string;
  category: string;
  brand?: string;
  color?: string;
  automatic?: boolean;
}
