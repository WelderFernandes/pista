"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Student, ClassSession, Transaction, InstructorSettings } from "./store";
import {
  getAppData,
  addStudentAction,
  addClassAction,
  confirmClassAction,
  startClassAction,
  cancelClassAction,
  completeClassAction,
  payPendingPaymentAction,
  updateSettingsAction,
} from "@/app/actions";

interface AppContextType {
  students: Student[];
  classes: ClassSession[];
  transactions: Transaction[];
  settings: InstructorSettings;
  addStudent: (student: Omit<Student, "id" | "progress" | "completedClasses" | "totalClasses" | "photoUrl">) => void;
  addClass: (session: Omit<ClassSession, "id" | "status" | "studentPhoto" | "instructorName"> & { studentPhoto?: string; instructorName?: string }) => void;
  confirmClass: (classId: string) => void;
  cancelClass: (classId: string) => void;
  completeClass: (classId: string) => void;
  startClass: (classId: string) => void;
  updateSettings: (settings: InstructorSettings) => void;
  payPendingPayment: (studentId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{
    students: Student[];
    classes: ClassSession[];
    transactions: Transaction[];
    settings: InstructorSettings;
  }>({
    students: [],
    classes: [],
    transactions: [],
    settings: {
      workDays: [1, 2, 3, 4, 5, 6],
      workStart: "08:00",
      workEnd: "18:00",
      lunchStart: "12:00",
      lunchEnd: "13:30",
      extraDays: [],
      city: "São Paulo",
      neighborhoods: [],
      meetingPoints: [],
      hourlyRate: 12000,
      categories: ["B"],
      bio: "",
    },
  });

  const [loading, setLoading] = useState(true);

  // Função para recarregar todos os dados do banco de dados correspondente ao Tenant ativo
  const reloadData = async () => {
    try {
      const appData = await getAppData();
      setData(appData);
    } catch (error) {
      console.error("Erro ao carregar dados do banco de dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const { data: session, isPending } = useSession();

  // Carrega dados iniciais na montagem do Provider ou quando a sessão muda
  useEffect(() => {
    if (isPending) return;
    
    if (session?.session?.activeOrganizationId) {
      reloadData();
    } else {
      setLoading(false);
    }
  }, [session, isPending]);

  const addStudent = async (newS: Omit<Student, "id" | "progress" | "completedClasses" | "totalClasses" | "photoUrl">) => {
    try {
      await addStudentAction(newS);
      await reloadData();
    } catch (err) {
      console.error("Erro ao adicionar aluno no banco:", err);
    }
  };

  const addClass = async (session: Omit<ClassSession, "id" | "status" | "studentPhoto" | "instructorName"> & { studentPhoto?: string; instructorName?: string }) => {
    try {
      await addClassAction(session);
      await reloadData();
    } catch (err) {
      console.error("Erro ao agendar aula no banco:", err);
    }
  };

  const confirmClass = async (classId: string) => {
    try {
      await confirmClassAction(classId);
      await reloadData();
    } catch (err) {
      console.error("Erro ao confirmar aula no banco:", err);
    }
  };

  const startClass = async (classId: string) => {
    try {
      await startClassAction(classId);
      await reloadData();
    } catch (err) {
      console.error("Erro ao iniciar aula no banco:", err);
    }
  };

  const cancelClass = async (classId: string) => {
    try {
      await cancelClassAction(classId);
      await reloadData();
    } catch (err) {
      console.error("Erro ao cancelar aula no banco:", err);
    }
  };

  const completeClass = async (classId: string) => {
    try {
      await completeClassAction(classId);
      await reloadData();
    } catch (err) {
      console.error("Erro ao concluir aula no banco:", err);
    }
  };

  const payPendingPayment = async (studentId: string, amount: number) => {
    try {
      await payPendingPaymentAction(studentId, amount);
      await reloadData();
    } catch (err) {
      console.error("Erro ao registrar pagamento no banco:", err);
    }
  };

  const updateSettings = async (newSettings: InstructorSettings) => {
    try {
      await updateSettingsAction(newSettings);
      await reloadData();
    } catch (err) {
      console.error("Erro ao atualizar configurações no banco:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        students: data.students,
        classes: data.classes,
        transactions: data.transactions,
        settings: data.settings,
        addStudent,
        addClass,
        confirmClass,
        cancelClass,
        completeClass,
        startClass,
        updateSettings,
        payPendingPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
