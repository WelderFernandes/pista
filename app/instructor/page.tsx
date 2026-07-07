"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function InstructorDashboard() {
  const { students, classes, confirmClass, completeClass, addClass } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const [classType, setClassType] = useState("Aula de Baliza");
  const [classDate, setClassDate] = useState("2026-06-08");
  const [classTime, setClassTime] = useState("14:00");
  const [meetingPoint, setMeetingPoint] = useState("Centro");

  const upcomingClasses = classes.filter((c) => c.status !== "Concluída" && c.status !== "Cancelada");
  const completedCount = classes.filter((c) => c.status === "Concluída").length;

  // Simple hardcoded revenue calculation
  const totalRevenue = completedCount * 120 + 2450; // Base baseline + completed classes

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
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Painel Geral</h2>
          <p className="text-slate-500 text-sm">Resumo operacional e próximas tarefas do dia.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/20 items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Agendamento
        </button>
      </div>

      {/* Stats Cards (Bento Grid Style) */}
      <section className="grid grid-cols-2 gap-4">
        {/* Faturamento Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
              +12%
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Faturamento</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">R$ {totalRevenue.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        {/* Aulas Realizadas Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
              Semanal
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Aulas Concluídas</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{24 + completedCount}</p>
          </div>
        </div>
      </section>

      {/* Próximas Aulas Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Próximas Aulas do Dia</h3>
          <Link
            href="/instructor/agenda"
            className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Ver agenda completa
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {upcomingClasses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-100 rounded-xl">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-400 font-medium">Sem aulas agendadas pendentes.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {upcomingClasses.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                {/* Visual Highlight for Pending or Confirmed */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                    item.status === "Confirmada" ? "bg-blue-600" : "bg-yellow-500"
                  }`}
                />

                <div className="flex items-center gap-3 pl-2">
                  <Image
                    alt={item.studentName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                    src={item.studentPhoto}
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {item.studentName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.meetingPoint} • {item.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pl-3 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <p className="text-base font-extrabold text-blue-600">{item.time}</p>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 uppercase ${
                        item.status === "Confirmada"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.status === "Pendente" && (
                      <button
                        onClick={() => confirmClass(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Confirmar
                      </button>
                    )}
                    {item.status === "Confirmada" && (
                      <button
                        onClick={() => completeClass(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
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
      </section>

      {/* FAB (Mobile Only) */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Agendar Nova Aula</h3>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="selectedStudent" className="text-xs">Selecione o Aluno</Label>
                <div className="mt-1">
                  <select
                    id="selectedStudent"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-slate-755 transition-colors duration-200"
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
                <Label htmlFor="classType" className="text-xs">Tipo de Aula</Label>
                <div className="mt-1">
                  <select
                    id="classType"
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-slate-755 transition-colors duration-200"
                  >
                    <option value="Aula de Baliza">Aula de Baliza</option>
                    <option value="Prática de Direção">Prática de Direção</option>
                    <option value="Percurso de Exame">Percurso de Exame</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="classDate" className="text-xs">Data</Label>
                  <div className="mt-1">
                    <Input
                      type="date"
                      id="classDate"
                      value={classDate}
                      onChange={(e) => setClassDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="classTime" className="text-xs">Horário</Label>
                  <div className="mt-1">
                    <Input
                      type="time"
                      id="classTime"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="meetingPoint" className="text-xs">Ponto de Encontro</Label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="meetingPoint"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    placeholder="Ex: Centro, Pista de Baliza"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-xs transition-transform active:scale-98 cursor-pointer mt-2"
              >
                Confirmar Agendamento
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
