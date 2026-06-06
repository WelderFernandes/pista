"use client";

import { useState, useEffect } from "react";

export interface InstructorSettings {
  workDays: number[];
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  extraDays: { date: string; start: string; end: string }[];
  city: string;
  neighborhoods: string[];
  meetingPoints: string[];
  hourlyRate: number;
  categories: string[];
  bio?: string;
}

export interface Student {
  id: string;
  name: string;
  category: string;
  progress: number; // e.g., 60
  completedClasses: number;
  totalClasses: number;
  photoUrl: string;
  pendingPayment: number;
  meetingPoint: string;
  phone: string;
  email: string;
}

export interface ClassSession {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto: string;
  type: string; // e.g. "Aula de Baliza", "Prática de Direção", "Percurso de Exame"
  date: string; // e.g. "2026-06-08"
  time: string; // e.g. "14:00"
  duration: string; // e.g. "14:00 - 15:40"
  meetingPoint: string;
  status: "Confirmada" | "Pendente" | "Cancelada" | "Concluída" | "Em andamento";
  instructorName: string;
}

export interface Transaction {
  id: string;
  studentName: string;
  amount: number;
  type: "payment" | "expense";
  date: string;
  status: "Recebido" | "Pendente" | "Atrasado";
  description: string;
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: "mariana-costa",
    name: "Mariana Costa Silva",
    category: "B (Carro)",
    progress: 60,
    completedClasses: 12,
    totalClasses: 20,
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcYC49gnQHyORIvqGwE3WVPlQpEEo_2rcGqxv90gPI0UL-8cHL1jE-hr08ErRhrGyaOCnzIXFAvAu-Y23apkm4mU1oFNL7XGlQDshIjte4e-Lljs0EI4uQuth6rnfe32x5z6CxN42rOxE8KXNzUYFI3snjUmmlRKrmnJcuudKc3zvyQjnucFGgtA4kirUs22QMw7vAxhLORKCV5VXRlncOvbKeBmzvUvv5aDZcE0PC8lm8h24k-G-2zb4RmOgHHpEpaLJaupvS-aY",
    pendingPayment: 150.00,
    meetingPoint: "Centro",
    phone: "(11) 98765-4321",
    email: "mariana.silva@email.com"
  },
  {
    id: "rafael-souza",
    name: "Rafael Souza",
    category: "B (Carro)",
    progress: 40,
    completedClasses: 8,
    totalClasses: 20,
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
    pendingPayment: 0.00,
    meetingPoint: "Busca na Residência",
    phone: "(11) 91234-5678",
    email: "rafael.souza@email.com"
  },
  {
    id: "beatriz-lima",
    name: "Beatriz Lima",
    category: "A (Moto)",
    progress: 80,
    completedClasses: 16,
    totalClasses: 20,
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXI6m_H1FJGSYFqoFQmc2TkCWx-gBC6HiGsXCQUA8yrATa1IzKcZbryflfWubUVop34t_FPqEP1Cj-gU3lezS7CHv7nsQ_dkiu5A9VSNDcq8MtcfE8q_EpTNXfkTR7qy-UTYoT_k6vsLcnliZBqHfFDbwzIynUGp5j6OuHlsptpv4C3p6Am5FywHlkyEBgZfsDxMtI0ymOORILUOfRuReR7FDYw8R9BcnGrcDpeb9aaRd6yf19SkgyqmTrccyeItntzQeIGA3_fDc",
    pendingPayment: 320.00,
    meetingPoint: "Pista de Treinamento",
    phone: "(11) 99887-7665",
    email: "beatriz.lima@email.com"
  }
];

const INITIAL_CLASSES: ClassSession[] = [
  {
    id: "class-1",
    studentId: "mariana-costa",
    studentName: "Mariana Costa Silva",
    studentPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcYC49gnQHyORIvqGwE3WVPlQpEEo_2rcGqxv90gPI0UL-8cHL1jE-hr08ErRhrGyaOCnzIXFAvAu-Y23apkm4mU1oFNL7XGlQDshIjte4e-Lljs0EI4uQuth6rnfe32x5z6CxN42rOxE8KXNzUYFI3snjUmmlRKrmnJcuudKc3zvyQjnucFGgtA4kirUs22QMw7vAxhLORKCV5VXRlncOvbKeBmzvUvv5aDZcE0PC8lm8h24k-G-2zb4RmOgHHpEpaLJaupvS-aY",
    type: "Aula de Baliza",
    date: "2026-06-08",
    time: "14:00",
    duration: "14:00 - 15:40",
    meetingPoint: "Centro",
    status: "Confirmada",
    instructorName: "Carlos Eduardo"
  },
  {
    id: "class-2",
    studentId: "rafael-souza",
    studentName: "Rafael Souza",
    studentPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
    type: "Busca na Residência",
    date: "2026-06-08",
    time: "16:30",
    duration: "16:30 - 18:10",
    meetingPoint: "Residência do Aluno",
    status: "Pendente",
    instructorName: "Carlos Eduardo"
  },
  {
    id: "class-3",
    studentId: "beatriz-lima",
    studentName: "Beatriz Lima",
    studentPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXI6m_H1FJGSYFqoFQmc2TkCWx-gBC6HiGsXCQUA8yrATa1IzKcZbryflfWubUVop34t_FPqEP1Cj-gU3lezS7CHv7nsQ_dkiu5A9VSNDcq8MtcfE8q_EpTNXfkTR7qy-UTYoT_k6vsLcnliZBqHfFDbwzIynUGp5j6OuHlsptpv4C3p6Am5FywHlkyEBgZfsDxMtI0ymOORILUOfRuReR7FDYw8R9BcnGrcDpeb9aaRd6yf19SkgyqmTrccyeItntzQeIGA3_fDc",
    type: "Prática de Baliza",
    date: "2026-06-08",
    time: "18:00",
    duration: "18:00 - 19:40",
    meetingPoint: "Pista de Treinamento",
    status: "Pendente",
    instructorName: "Carlos Eduardo"
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "t-1",
    studentName: "Mariana Costa Silva",
    amount: 150.00,
    type: "payment",
    date: "2026-06-05",
    status: "Recebido",
    description: "Pacote 10 Aulas Práticas (Parcela 1)"
  },
  {
    id: "t-2",
    studentName: "Beatriz Lima",
    amount: 320.00,
    type: "payment",
    date: "2026-06-04",
    status: "Pendente",
    description: "Taxa de Exame Prático Detran"
  },
  {
    id: "t-3",
    studentName: "Rafael Souza",
    amount: 120.00,
    type: "payment",
    date: "2026-06-03",
    status: "Recebido",
    description: "Aula Avulsa de Direção"
  }
];

const DEFAULT_SETTINGS: InstructorSettings = {
  workDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
  workStart: "08:00",
  workEnd: "18:00",
  lunchStart: "12:00",
  lunchEnd: "13:30",
  extraDays: [],
  city: "São Paulo",
  neighborhoods: ["Centro", "Pinheiros", "Vila Madalena", "Jardins"],
  meetingPoints: ["Centro Comercial", "Estação de Metrô Pinheiros", "Shopping Boulevard"],
  hourlyRate: 120,
  categories: ["B"],
  bio: "Instrutor credenciado com mais de 10 anos de experiência, especializado em direção defensiva e preparação para exames práticos."
};

export function getStoredData() {
  if (typeof window === "undefined") {
    return {
      students: INITIAL_STUDENTS,
      classes: INITIAL_CLASSES,
      transactions: INITIAL_TRANSACTIONS,
      settings: DEFAULT_SETTINGS
    };
  }

  const students = localStorage.getItem("vc_students");
  const classes = localStorage.getItem("vc_classes");
  const transactions = localStorage.getItem("vc_transactions");
  const settings = localStorage.getItem("vc_settings");

  return {
    students: students ? JSON.parse(students) : INITIAL_STUDENTS,
    classes: classes ? JSON.parse(classes) : INITIAL_CLASSES,
    transactions: transactions ? JSON.parse(transactions) : INITIAL_TRANSACTIONS,
    settings: settings ? JSON.parse(settings) : DEFAULT_SETTINGS
  };
}

export function saveStoredData(
  students: Student[],
  classes: ClassSession[],
  transactions: Transaction[],
  settings?: InstructorSettings
) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vc_students", JSON.stringify(students));
  localStorage.setItem("vc_classes", JSON.stringify(classes));
  localStorage.setItem("vc_transactions", JSON.stringify(transactions));
  if (settings) {
    localStorage.setItem("vc_settings", JSON.stringify(settings));
  }
}
