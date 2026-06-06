"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";

export default function InstructorAgenda() {
  const { students, classes, addClass, confirmClass, completeClass, cancelClass } = useApp();
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const [classType, setClassType] = useState("Aula de Baliza");
  const [classTime, setClassTime] = useState("08:00");
  const [meetingPoint, setMeetingPoint] = useState("Centro");

  const dates = [
    { day: "Seg", num: "08", dateStr: "2026-06-08" },
    { day: "Ter", num: "09", dateStr: "2026-06-09" },
    { day: "Qua", num: "10", dateStr: "2026-06-10" },
    { day: "Qui", num: "11", dateStr: "2026-06-11" },
    { day: "Sex", num: "12", dateStr: "2026-06-12" },
    { day: "Sáb", num: "13", dateStr: "2026-06-13" },
  ];

  // Time slots for high fidelity calendar schedule
  const timeSlots = ["08:00", "09:40", "11:20", "14:00", "15:40", "17:20", "19:00"];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudent);
    if (!student) return;

    addClass({
      studentId: student.id,
      studentName: student.name,
      type: classType,
      date: selectedDate,
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Agenda de Aulas</h2>
          <p className="text-slate-500 text-sm">Visualize e coordene seus horários de instrução.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agendar Aula
        </button>
      </div>

      {/* Week Selector Grid */}
      <section className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Junho de 2026</span>
          <span className="text-xs font-semibold text-orange-600">Semana Atual</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-[10px] uppercase font-medium">{d.day}</span>
                <span className="text-base font-extrabold">{d.num}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Schedule List */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Horários para {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>

        <div className="flex flex-col gap-4">
          {timeSlots.map((slot) => {
            // Find class at this slot
            const session = classes.find((c) => c.date === selectedDate && c.time === slot);

            if (session) {
              return (
                <div
                  key={session.id}
                  className="flex gap-4 items-start relative group"
                >
                  {/* Time label */}
                  <div className="w-14 text-right pt-1 flex flex-col">
                    <span className="text-sm font-extrabold text-orange-600">{slot}</span>
                    <span className="text-[9px] text-slate-400">Ocupado</span>
                  </div>

                  {/* Divider line */}
                  <div className="w-px self-stretch bg-orange-200 relative">
                    <div className="absolute top-2 -left-1 w-2.5 h-2.5 rounded-full bg-orange-600 border border-white" />
                  </div>

                  {/* Student Class details */}
                  <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 hover:border-orange-200 transition-all flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        alt={session.studentName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        src={session.studentPhoto}
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{session.studentName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{session.type} • {session.meetingPoint}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        session.status === "Confirmada" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                        session.status === "Concluída" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        session.status === "Cancelada" ? "bg-red-50 text-red-700 border border-red-100" :
                        "bg-yellow-50 text-yellow-700 border border-yellow-100"
                      }`}>
                        {session.status}
                      </span>
                      
                      {session.status === "Pendente" && (
                        <button
                          onClick={() => confirmClass(session.id)}
                          className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Confirmar
                        </button>
                      )}
                      {session.status === "Confirmada" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => completeClass(session.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Concluir
                          </button>
                          <button
                            onClick={() => cancelClass(session.id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Empty slot
            return (
              <div key={slot} className="flex gap-4 items-center group">
                {/* Time label */}
                <div className="w-14 text-right flex flex-col">
                  <span className="text-sm font-bold text-slate-400">{slot}</span>
                  <span className="text-[9px] text-slate-300">Livre</span>
                </div>

                {/* Divider line */}
                <div className="w-px h-10 bg-slate-100 relative">
                  <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-slate-200 border border-white group-hover:bg-orange-300 transition-colors" />
                </div>

                {/* Empty container */}
                <button
                  onClick={() => {
                    setClassTime(slot);
                    setShowAddModal(true);
                  }}
                  className="flex-1 py-3 px-4 border border-dashed border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/10 text-left text-xs text-slate-400 font-medium transition-all active:scale-99 flex items-center justify-between cursor-pointer"
                >
                  <span>Horário Disponível para Agendamento</span>
                  <span className="text-orange-600 font-bold hover:underline flex items-center gap-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Reservar
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

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
            <h3 className="text-lg font-bold text-slate-900 mb-4">Reservar Horário: {classTime}</h3>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Selecione o Aluno</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Tipo de Aula</label>
                <select
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                >
                  <option value="Aula de Baliza">Aula de Baliza</option>
                  <option value="Prática de Direção">Prática de Direção</option>
                  <option value="Percurso de Exame">Percurso de Exame</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Ponto de Encontro</label>
                <input
                  type="text"
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="Ex: Centro, Pista de Baliza"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl shadow-lg mt-2 text-sm transition-transform active:scale-98 cursor-pointer"
              >
                Confirmar Reservar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
