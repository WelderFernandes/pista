"use client";

import { useApp } from "@/lib/context";
import { useState } from "react";

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
                <label className="text-xs text-slate-500 font-bold block mb-1">Tipo de Aula</label>
                <select
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Aula de Baliza">Aula de Baliza</option>
                  <option value="Prática de Direção">Prática de Direção</option>
                  <option value="Percurso de Exame">Percurso de Exame</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Data Desejada</label>
                  <input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Horário de Início</label>
                  <select
                    value={classTime}
                    onChange={(e) => setClassTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-blue-500 focus:outline-none"
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

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Ponto de Encontro</label>
                <input
                  type="text"
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="Ex: Centro, Pista de Baliza"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-lg mt-2 text-sm transition-transform active:scale-98 cursor-pointer"
              >
                Enviar Solicitação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
