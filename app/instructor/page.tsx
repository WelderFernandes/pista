"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/context";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/lib/utils";

export default function InstructorDashboard() {
  const { students, classes, confirmClass, completeClass, addClass, transactions } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const [classType, setClassType] = useState("Aula de Baliza");
  const [classDate, setClassDate] = useState(new Date().toISOString().split("T")[0]);
  const [classTime, setClassTime] = useState("14:00");
  const [meetingPoint, setMeetingPoint] = useState("Centro");

  const upcomingClasses = classes
    .filter((c) => c.status !== "Concluída" && c.status !== "Cancelada")
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

  const completedCount = classes.filter((c) => c.status === "Concluída").length;

  // Real database-driven revenue calculation from confirmed payments
  const totalRevenue = transactions
    .filter((t) => t.type === "payment" && t.status === "Recebido")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudent);
    if (!student) return;

    addClass({
      studentId: student.id,
      studentName: student.name,
      type: classType,
      date: classDate,
      time: classTime,
      duration: `${classTime} - ${calculateEndTime(classTime)}`,
      meetingPoint: meetingPoint,
    });

    setShowAddModal(false);
  };

  const calculateEndTime = (timeStr: string) => {
    const [hour, min] = timeStr.split(":").map(Number);
    let endHour = hour + 1;
    let endMin = min + 40;
    if (endMin >= 60) {
      endHour += 1;
      endMin -= 60;
    }
    return `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Painel Geral</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Resumo operacional e tarefas do dia</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] items-center gap-1.5 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agendar Aula
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Faturamento Card (Bento 1) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)] relative overflow-hidden flex flex-col justify-between h-[160px] hover:scale-[1.01] transition-transform duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100/50">
              Mês Atual
            </span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Faturamento</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{formatCentsToBRL(totalRevenue)}</p>
          </div>
        </div>

        {/* Aulas Realizadas Card (Bento 2) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)] relative overflow-hidden flex flex-col justify-between h-[160px] hover:scale-[1.01] transition-transform duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100/50">
              Semanal
            </span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Aulas Concluídas</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{completedCount}</p>
          </div>
        </div>

        {/* Ações Rápidas Card (Bento 3) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[160px] hover:scale-[1.01] transition-transform duration-200">
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Ações Rápidas</p>
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-0.5">Gestão Direta</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.96] text-white rounded-xl text-[10px] font-bold text-center transition-all duration-200 shadow-xs cursor-pointer"
            >
              Agendar Aula
            </button>
            <Link
              href="/instructor/students"
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.96] text-slate-700 dark:bg-slate-850 dark:text-slate-250 rounded-xl text-[10px] font-bold text-center transition-all duration-200 border border-slate-200/10 cursor-pointer flex items-center justify-center"
            >
              Ver Alunos
            </Link>
          </div>
        </div>

        {/* Próximas Aulas Section (Bento 4 - span-2) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)] md:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Próximas Aulas do Dia</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </h3>
            <Link
              href="/instructor/agenda"
              className="text-[10px] text-blue-650 dark:text-blue-450 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 active:scale-95"
            >
              Ver agenda completa
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200/60 dark:border-slate-800/60 rounded-xl flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Sem aulas agendadas pendentes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingClasses.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-900/60 hover:border-blue-200/85 dark:hover:border-blue-900/60 hover:scale-[1.005] active:scale-[0.995] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      item.status === "Confirmada" ? "bg-blue-600" : "bg-amber-500"
                    }`}
                  />

                  <div className="flex items-center gap-3 pl-1.5">
                    <Image
                      alt={item.studentName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-slate-900"
                      src={item.studentPhoto}
                      width={40}
                      height={40}
                      unoptimized
                    />
                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs leading-none">
                        {item.studentName}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.meetingPoint} • {item.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-1.5 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-black text-blue-600 dark:text-blue-500 leading-none">{item.time}</p>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold mt-1.5 uppercase tracking-wider ${
                          item.status === "Confirmada"
                            ? "bg-blue-50 text-blue-650 border border-blue-100/55 dark:bg-blue-950/30 dark:text-blue-400"
                            : "bg-amber-50 text-amber-700 border border-amber-100/55 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.status === "Pendente" && (
                        <button
                          onClick={() => confirmClass(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold hover:scale-[1.02] active:scale-[0.96] transition-all cursor-pointer shadow-xs"
                        >
                          Confirmar
                        </button>
                      )}
                      {item.status === "Confirmada" && (
                        <button
                          onClick={() => completeClass(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold hover:scale-[1.02] active:scale-[0.96] transition-all cursor-pointer shadow-xs"
                        >
                          Concluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alunos Recentes (Bento 5 - span-1) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center justify-between">
              <span>Alunos Recentes</span>
              <Link href="/instructor/students" className="text-[10px] text-blue-650 dark:text-blue-450 font-bold hover:underline active:scale-95">Ver todos</Link>
            </h3>
            <div className="flex flex-col gap-3.5">
              {students.slice(0, 3).map((st) => (
                <div key={st.id} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px]">{st.name}</span>
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500">{st.completedClasses}/{st.totalClasses} aulas</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${(st.completedClasses / (st.totalClasses || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <div className="text-center py-6 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Nenhum aluno ativo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAB (Mobile Only) */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-xl shadow-blue-650/30 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full relative animate-scale-up">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-5 pb-3 border-b border-slate-100 dark:border-slate-850">
              Agendar Nova Aula
            </h3>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="selectedStudent" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Selecione o Aluno</Label>
                <div className="mt-1">
                  <select
                    id="selectedStudent"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-slate-755 transition-colors duration-200 cursor-pointer font-medium"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="classType" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Tipo de Aula</Label>
                <div className="mt-1">
                  <select
                    id="classType"
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-slate-755 transition-colors duration-200 cursor-pointer font-medium"
                  >
                    <option value="Aula de Baliza">Aula de Baliza</option>
                    <option value="Prática de Direção">Prática de Direção</option>
                    <option value="Percurso de Exame">Percurso de Exame</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="classDate" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Data</Label>
                  <div className="mt-1">
                    <Input
                      type="date"
                      id="classDate"
                      value={classDate}
                      onChange={(e) => setClassDate(e.target.value)}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="classTime" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Horário</Label>
                  <div className="mt-1">
                    <Input
                      type="time"
                      id="classTime"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="meetingPoint" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Ponto de Encontro</Label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="meetingPoint"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    placeholder="Ex: Centro, Pista de Baliza"
                    className="rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs h-10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2 rounded-xl uppercase tracking-wider text-[10px]"
              >
                Confirmar Agendamento
              </Button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
