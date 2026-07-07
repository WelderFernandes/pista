"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/context";
import { ClassSession } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


function SlideToUnlock({ onUnlock, text = "Deslize para iniciar a aula" }: { onUnlock: () => void; text?: string }) {
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startDrag = () => {
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const handleWidth = 48; // Width of the drag handle
    const padding = 8;
    const maxDistance = rect.width - handleWidth - padding;
    const currentDistance = clientX - rect.left - handleWidth / 2;
    const rawPos = (currentDistance / maxDistance) * 100;
    const pos = Math.min(Math.max(0, rawPos), 100);
    setSliderPos(pos);
  };

  const endDrag = () => {
    setIsDragging(false);
    if (sliderPos >= 90) {
      setSliderPos(100);
      onUnlock();
    } else {
      setSliderPos(0);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => moveDrag(e.clientX);
    const handleGlobalMouseUp = () => endDrag();
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) moveDrag(e.touches[0].clientX);
    };
    const handleGlobalTouchEnd = () => endDrag();

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: true });
    window.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, sliderPos]);

  return (
    <div
      ref={containerRef}
      className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-14 rounded-sm relative flex items-center justify-center select-none overflow-hidden w-full shadow-inner"
    >
      {/* Background fill based on drag position */}
      <div 
        className="absolute left-1 top-1 bottom-1 bg-linear-to-r from-blue-600 to-blue-600 rounded-sm transition-all opacity-80"
        style={{ width: `calc(${sliderPos}% + 44px - (${sliderPos}px * 0.44))` }}
      />

      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 select-none pointer-events-none z-10 transition-opacity" style={{ opacity: (100 - sliderPos) / 100 }}>
        {text}
      </span>

      {/* Draggable Handle */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className="absolute top-1 w-12 bottom-1 bg-white rounded-sm flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-20"
        style={{ 
          left: `calc(${sliderPos}% - ${(sliderPos * 40) / 100}px + 4px)` 
        }}
      >
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

export default function InstructorAgenda() {
  const { students, classes, addClass, confirmClass, completeClass, cancelClass, startClass, settings } = useApp();
  const [selectedDate, setSelectedDate] = useState("2026-06-08");

  const extraDayConfig = settings?.extraDays?.find((ed) => ed.date === selectedDate);
  const dayOfWeek = new Date(selectedDate + "T00:00:00").getDay();
  const isNormalWorkDay = settings?.workDays?.includes(dayOfWeek);
  const isWorking = !!extraDayConfig || isNormalWorkDay;

  const workStart = extraDayConfig ? extraDayConfig.start : (settings?.workStart || "08:00");
  const workEnd = extraDayConfig ? extraDayConfig.end : (settings?.workEnd || "18:00");
  const lunchStart = settings?.lunchStart || "12:00";
  const lunchEnd = settings?.lunchEnd || "13:30";
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Lock body scroll when detail sheet is open on mobile to prevent background scrolling
  useEffect(() => {
    if (selectedClassId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedClassId]);

  // Form state for scheduling
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const [classType, setClassType] = useState("Aula de Baliza");
  const [classTime, setClassTime] = useState("08:00");
  const [meetingPoint, setMeetingPoint] = useState("Centro");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate June 2026 dates dynamically
  const dates = Array.from({ length: 30 }, (_, i) => {
    const dayNum = String(i + 1).padStart(2, "0");
    const dateStr = `2026-06-${dayNum}`;
    const dateObj = new Date(dateStr + "T00:00:00");
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return {
      day: daysOfWeek[dateObj.getDay()],
      num: dayNum,
      dateStr,
    };
  });

  // Auto-scroll selected button to the center of the list
  useEffect(() => {
    const activeEl = document.getElementById(`date-btn-${selectedDate}`);
    if (activeEl && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const leftPos = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({ left: leftPos, behavior: "smooth" });
    }
  }, [selectedDate]);

  const handlePrevDay = () => {
    const currentIndex = dates.findIndex((d) => d.dateStr === selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1].dateStr);
    }
  };

  const handleNextDay = () => {
    const currentIndex = dates.findIndex((d) => d.dateStr === selectedDate);
    if (currentIndex < dates.length - 1) {
      setSelectedDate(dates[currentIndex + 1].dateStr);
    }
  };

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

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Agenda de Aulas</h2>
          <p className="text-slate-500 text-sm">Visualize e coordene seus horários de instrução.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agendar Aula
        </button>
      </div>

      {/* Week Selector Grid */}
      <section className="bg-white p-4 rounded-sm border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Junho de 2026</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="p-1 rounded-sm hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              disabled={selectedDate === "2026-06-01"}
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Navegar</span>
            <button
              onClick={handleNextDay}
              className="p-1 rounded-sm hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              disabled={selectedDate === "2026-06-30"}
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 pb-2 scrollbar-none snap-x"
        >
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                id={`date-btn-${d.dateStr}`}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`py-3 px-4 min-w-[62px] rounded-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer snap-center ${
                  isSelected
                    ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20"
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
      <section className="bg-white p-6 rounded-sm border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Horários para {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>

        <div className="flex flex-col gap-4">
          {!isWorking ? (
            <div className="text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-sm flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Dia de Folga</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Você normalmente não trabalha aos{" "}
                <span className="font-semibold text-slate-600">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long" })}s
                </span>
                .
              </p>
              <a
                href="/instructor/settings"
                className="mt-2 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4.5 py-2.5 rounded-sm transition-all active:scale-95 shadow-sm"
              >
                Configurar Agenda Extra
              </a>
            </div>
          ) : (
            timeSlots.map((slot) => {
              const session = classes.find((c) => c.date === selectedDate && c.time === slot);

              if (session) {
                return (
                  <div
                    key={session.id}
                    className="flex gap-4 items-start relative group"
                  >
                    {/* Time label */}
                    <div className="w-14 text-right pt-1 flex flex-col">
                      <span className="text-sm font-extrabold text-blue-600">{slot}</span>
                      <span className="text-[9px] text-slate-400">Ocupado</span>
                    </div>

                    {/* Divider line */}
                    <div className="w-px self-stretch bg-blue-200 relative">
                      <div className="absolute top-2 -left-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" />
                    </div>

                    {/* Student Class details (Clickable card to open modal) */}
                    <div 
                      onClick={() => setSelectedClassId(session.id)}
                      className="flex-1 bg-white p-4 rounded-sm border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between gap-4 shadow-sm cursor-pointer hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          alt={session.studentName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                          src={session.studentPhoto}
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{session.studentName}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{session.type} • {session.meetingPoint}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          session.status === "Confirmada" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          session.status === "Concluída" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          session.status === "Cancelada" ? "bg-red-50 text-red-700 border border-red-100" :
                          session.status === "Em andamento" ? "bg-blue-50 text-blue-700 border border-blue-100 animate-pulse" :
                          "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}>
                          {session.status}
                        </span>
                        <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              }

              // Evaluate constraints: outside work start/end or during lunch
              const slotEnd = calculateEndTime(slot);
              const isOutside = slot < workStart || slot >= workEnd;
              const isLunch = !extraDayConfig && ((slot >= lunchStart && slot < lunchEnd) || (slotEnd > lunchStart && slotEnd <= lunchEnd));

              if (isOutside) {
                return (
                  <div key={slot} className="flex gap-4 items-center opacity-60">
                    <div className="w-14 text-right flex flex-col">
                      <span className="text-sm font-bold text-slate-400">{slot}</span>
                      <span className="text-[9px] text-slate-300">Fechado</span>
                    </div>
                    <div className="w-px h-10 bg-slate-100 relative">
                      <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-slate-100 border border-white" />
                    </div>
                    <div className="flex-1 py-3 px-4 bg-slate-50/50 rounded-sm text-left text-xs text-slate-400 font-semibold flex items-center justify-between border border-slate-100 select-none">
                      <span>Fora do Expediente ({workStart} - {workEnd})</span>
                      <svg className="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                );
              }

              if (isLunch) {
                return (
                  <div key={slot} className="flex gap-4 items-center">
                    <div className="w-14 text-right flex flex-col">
                      <span className="text-sm font-bold text-slate-400">{slot}</span>
                      <span className="text-[9px] text-slate-300">Almoço</span>
                    </div>
                    <div className="w-px h-10 bg-blue-100 relative">
                      <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-blue-300 border border-white" />
                    </div>
                    <div className="flex-1 py-3 px-4 bg-blue-50/30 border border-dashed border-blue-100 rounded-sm text-left text-xs text-blue-700 font-semibold flex items-center justify-between select-none">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                        </svg>
                        Pausa para Almoço ({lunchStart} - {lunchEnd})
                      </span>
                      <span className="text-[10px] text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full font-bold">INTERVALO</span>
                    </div>
                  </div>
                );
              }

              // Empty slot (schedulable)
              return (
                <div key={slot} className="flex gap-4 items-center group">
                  {/* Time label */}
                  <div className="w-14 text-right flex flex-col">
                    <span className="text-sm font-bold text-slate-400">{slot}</span>
                    <span className="text-[9px] text-slate-300">Livre</span>
                  </div>

                  {/* Divider line */}
                  <div className="w-px h-10 bg-slate-100 relative">
                    <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-slate-200 border border-white group-hover:bg-blue-300 transition-colors" />
                  </div>

                  {/* Empty container */}
                  <button
                    onClick={() => {
                      setClassTime(slot);
                      setShowAddModal(true);
                    }}
                    className="flex-1 py-3 px-4 border border-dashed border-slate-100 rounded-sm hover:border-blue-200 hover:bg-blue-50/10 text-left text-xs text-slate-400 font-medium transition-all active:scale-99 flex items-center justify-between cursor-pointer"
                  >
                    <span>Horário Disponível para Agendamento</span>
                    <span className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Reservar
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
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
                <Label htmlFor="selectedStudent" className="text-xs">Selecione o Aluno</Label>
                <div className="mt-1">
                  <select
                    id="selectedStudent"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full rounded-sm border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-slate-350 dark:focus:border-slate-700 transition-colors duration-200"
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
                    className="w-full rounded-sm border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-slate-350 dark:focus:border-slate-700 transition-colors duration-200"
                  >
                    <option value="Aula de Baliza">Aula de Baliza</option>
                    <option value="Prática de Direção">Prática de Direção</option>
                    <option value="Percurso de Exame">Percurso de Exame</option>
                  </select>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Confirmar Reserva
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Detail Bottom-Drawer Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-sm max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in flex flex-col gap-5 max-h-[90vh] md:max-h-none overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClassId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">Detalhes da Aula</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Ficha de acompanhamento operacional</p>
            </div>

            {/* Student card info */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-sm">
              <img
                alt={selectedClass.studentName}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-600/20"
                src={selectedClass.studentPhoto}
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedClass.studentName}</h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Aula 14 de 20
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Cat. B</span>
                </div>
              </div>
            </div>

            {/* Bento Grid Lesson Parameters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date & Time */}
              <div className="col-span-2 bg-slate-50 p-4 rounded-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Data</span>
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(selectedClass.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Horário</span>
                  <span className="text-xs font-bold text-slate-700">{selectedClass.duration}</span>
                </div>
              </div>

              {/* Class Type */}
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[9px] font-bold uppercase">Tipo de Aula</span>
                </div>
                <p className="text-xs font-bold text-slate-700">{selectedClass.type}</p>
              </div>

              {/* Meeting Point */}
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-[9px] font-bold uppercase">Local</span>
                </div>
                <p className="text-xs font-bold text-slate-700 truncate">{selectedClass.meetingPoint}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
              <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1.5">Anotações do Instrutor</span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Focar em controle de embreagem e alinhamento na vaga de baliza.
              </p>
            </div>

            {/* Custom slider button to start the class / complete actions */}
            <div className="mt-2 flex flex-col gap-3">
              {selectedClass.status === "Pendente" && (
                <button
                  onClick={() => {
                    confirmClass(selectedClass.id);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-sm shadow-lg shadow-blue-600/20 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmar Agendamento
                </button>
              )}

              {selectedClass.status === "Confirmada" && (
                <SlideToUnlock 
                  text="Arraste para Iniciar Aula"
                  onUnlock={() => {
                    startClass(selectedClass.id);
                  }}
                />
              )}

              {selectedClass.status === "Em andamento" && (
                <button
                  onClick={() => {
                    completeClass(selectedClass.id);
                    setSelectedClassId(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3.5 rounded-sm shadow-lg shadow-emerald-600/20 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Concluir Aula Prática
                </button>
              )}

              {selectedClass.status === "Concluída" && (
                <div className="text-center p-3.5 bg-emerald-50 border border-emerald-100 rounded-sm">
                  <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Esta aula foi concluída com sucesso!
                  </p>
                </div>
              )}

              {selectedClass.status !== "Concluída" && selectedClass.status !== "Cancelada" && (
                <div className="flex gap-2 justify-center mt-2">
                  <button
                    onClick={() => {
                      cancelClass(selectedClass.id);
                      setSelectedClassId(null);
                    }}
                    className="font-bold text-xs text-red-600 hover:text-red-700 py-2 px-4 rounded-sm hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Cancelar Aula
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
