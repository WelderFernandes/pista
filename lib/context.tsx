"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Student, ClassSession, Transaction, getStoredData, saveStoredData } from "./store";

interface AppContextType {
  students: Student[];
  classes: ClassSession[];
  transactions: Transaction[];
  addStudent: (student: Omit<Student, "id" | "progress" | "completedClasses" | "totalClasses" | "photoUrl">) => void;
  addClass: (session: Omit<ClassSession, "id" | "studentPhoto" | "status" | "instructorName">) => void;
  confirmClass: (classId: string) => void;
  cancelClass: (classId: string) => void;
  completeClass: (classId: string) => void;
  startClass: (classId: string) => void;
  payPendingPayment: (studentId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{
    students: Student[];
    classes: ClassSession[];
    transactions: Transaction[];
  }>({ students: [], classes: [], transactions: [] });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setData(getStoredData());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      saveStoredData(data.students, data.classes, data.transactions);
    }
  }, [data, initialized]);

  const addStudent = (newS: Omit<Student, "id" | "progress" | "completedClasses" | "totalClasses" | "photoUrl">) => {
    const id = newS.name.toLowerCase().replace(/\s+/g, "-");
    const student: Student = {
      ...newS,
      id,
      progress: 0,
      completedClasses: 0,
      totalClasses: 20,
      photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc", // Default avatar
    };

    setData((prev) => ({
      ...prev,
      students: [...prev.students, student],
    }));
  };

  const addClass = (session: Omit<ClassSession, "id" | "studentPhoto" | "status" | "instructorName">) => {
    const student = data.students.find((s) => s.id === session.studentId);
    const id = `class-${Date.now()}`;
    const newClass: ClassSession = {
      ...session,
      id,
      studentPhoto: student?.photoUrl || "",
      status: "Pendente",
      instructorName: "Carlos Eduardo",
    };

    setData((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
  };

  const confirmClass = (classId: string) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === classId ? { ...c, status: "Confirmada" as const } : c)),
    }));
  };

  const startClass = (classId: string) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === classId ? { ...c, status: "Em andamento" as const } : c)),
    }));
  };

  const cancelClass = (classId: string) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === classId ? { ...c, status: "Cancelada" as const } : c)),
    }));
  };

  const completeClass = (classId: string) => {
    setData((prev) => {
      const targetClass = prev.classes.find((c) => c.id === classId);
      if (!targetClass) return prev;

      const updatedClasses = prev.classes.map((c) =>
        c.id === classId ? { ...c, status: "Concluída" as const } : c
      );

      // Increment student progress if they had a class completed
      const updatedStudents = prev.students.map((s) => {
        if (s.id === targetClass.studentId) {
          const completed = Math.min(s.completedClasses + 1, s.totalClasses);
          const progress = Math.round((completed / s.totalClasses) * 100);
          return { ...s, completedClasses: completed, progress };
        }
        return s;
      });

      return {
        ...prev,
        classes: updatedClasses,
        students: updatedStudents,
      };
    });
  };

  const payPendingPayment = (studentId: string, amount: number) => {
    setData((prev) => {
      const student = prev.students.find((s) => s.id === studentId);
      if (!student) return prev;

      const newTransaction: Transaction = {
        id: `t-${Date.now()}`,
        studentName: student.name,
        amount,
        type: "payment",
        date: new Date().toISOString().split("T")[0],
        status: "Recebido",
        description: "Pagamento de Fatura Pendente (PIX)",
      };

      const updatedStudents = prev.students.map((s) => {
        if (s.id === studentId) {
          return { ...s, pendingPayment: Math.max(0, s.pendingPayment - amount) };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents,
        transactions: [newTransaction, ...prev.transactions],
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        students: data.students,
        classes: data.classes,
        transactions: data.transactions,
        addStudent,
        addClass,
        confirmClass,
        cancelClass,
        completeClass,
        startClass,
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
