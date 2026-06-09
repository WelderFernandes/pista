"use client";

import { useApp } from "@/lib/context";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StudentAgenda() {

  const { classes, addClass } = useApp();
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Form state
  const [classType, setClassType] = useState("Aula de Baliza");
  const [classDate, setClassDate] = useState("2026-06-08");
  const [classTime, setClassTime] = useState("14:00");
  const [meetingPoint, setMeetingPoint] = useState("Centro");

  const studentClasses = classes.filter((c) => c.studentId === "mariana-costa");

  const handleRequestClass = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      studentId: "mariana-costa",
      studentName: "Mariana Costa Silva",
      type: classType,
      date: classDate,
      time: classTime,
      duration: `${classTime} - ${calculateEndTime(classTime)}`,
      meetingPoint: meetingPoint,
    });
    setShowRequestModal(false);
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
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Minha Agenda</h2>
          <p className="text-slate-500 text-sm">Visualize suas aulas marcadas e solicite novos horários.</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Solicitar Aula
        </button>
      </div>

      {/* Classes list */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3">Cronograma de Aulas</h3>

        {studentClasses.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">Nenhuma aula agendada ainda.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {studentClasses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.type}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(item.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })} • {item.duration}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Ponto de Encontro: {item.meetingPoint}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    item.status === "Confirmada" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                    item.status === "Concluída" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    item.status === "Cancelada" ? "bg-red-50 text-red-700 border border-red-100" :
                    "bg-yellow-50 text-yellow-700 border border-yellow-100"
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Prof: {item.instructorName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Solicitar Agendamento de Aula</h3>

            <form onSubmit={handleRequestClass} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="classType" className="text-xs">Tipo de Aula</Label>
                <div className="mt-1">
                  <select
                    id="classType"
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-slate-750 transition-colors duration-200"
                  >
                    <option value="Aula de Baliza">Aula de Baliza</option>
                    <option value="Prática de Direção">Prática de Direção</option>
                    <option value="Percurso de Exame">Percurso de Exame</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="classDate" className="text-xs">Data Desejada</Label>
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
                  <Label htmlFor="classTime" className="text-xs">Horário de Início</Label>
                  <div className="mt-1">
                    <select
                      id="classTime"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-slate-750 transition-colors duration-200"
                    >
                      <option value="08:00">08:00</option>
                      <option value="09:40">09:40</option>
                      <option value="11:20">11:20</option>
                      <option value="14:00">14:00</option>
                      <option value="15:40">15:40</option>
                      <option value="17:20">17:20</option>
                      <option value="19:00">19:00</option>
                    </select>
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
                Enviar Solicitação
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
