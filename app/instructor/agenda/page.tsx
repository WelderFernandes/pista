"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
      className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-14 rounded-xl relative flex items-center justify-center select-none overflow-hidden w-full shadow-inner"
    >
      {/* Background fill based on drag position */}
      <div 
        className="absolute left-1 top-1 bottom-1 bg-linear-to-r from-blue-600 to-blue-600 rounded-xl transition-all opacity-80"
        style={{ width: `calc(${sliderPos}% + 44px - (${sliderPos}px * 0.44))` }}
      />

      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 select-none pointer-events-none z-10 transition-opacity" style={{ opacity: (100 - sliderPos) / 100 }}>
        {text}
      </span>

      {/* Draggable Handle */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className="absolute top-1 w-12 bottom-1 bg-white rounded-xl flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-20"
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
    <div className="flex flex-col gap-6 animate-fade-in-up relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Agenda de Aulas</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Visualize e coordene seus horários de instrução</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agendar Aula
        </button>
      </div>

      {/* Week Selector Grid */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Junho de 2026</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              disabled={selectedDate === "2026-06-01"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider">Navegar</span>
            <button
              onClick={handleNextDay}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              disabled={selectedDate === "2026-06-30"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                className={`py-2 px-3.5 min-w-[58px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 cursor-pointer snap-center ${
                  isSelected
                    ? "bg-blue-600 text-white font-bold shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                    : "bg-slate-50 dark:bg-slate-950/40 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <span className="text-[9px] uppercase font-bold tracking-tight opacity-80">{d.day}</span>
                <span className="text-sm font-black mt-0.5">{d.num}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Schedule List */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col gap-6">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white border-b border-slate-200/40 dark:border-slate-800/60 pb-3 uppercase tracking-wider text-[10px]">
          Horários para {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>

        <div className="flex flex-col gap-4">
          {!isWorking ? (
            <div className="text-center py-10 px-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs">Dia de Folga</h4>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                Você normalmente não trabalha aos{" "}
                <span className="font-bold text-slate-650 dark:text-slate-300">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long" })}s
                </span>
                .
              </p>
              <a
                href="/instructor/settings"
                className="mt-2 text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
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
                    className="flex gap-3.5 items-start relative group"
                  >
                    {/* Time label */}
                    <div className="w-14 text-right pt-2 flex flex-col gap-0.5">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-500 leading-none">{slot}</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Ocupado</span>
                    </div>

                    {/* Divider line */}
                    <div className="w-px self-stretch bg-blue-100 dark:bg-blue-900/60 relative">
                      <div className="absolute top-3 -left-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-white dark:border-slate-900" />
                    </div>

                    {/* Student Class details */}
                    <div 
                      onClick={() => setSelectedClassId(session.id)}
                      className="flex-1 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/40 dark:border-slate-900 hover:border-blue-200 dark:hover:border-blue-900 transition-all flex items-center justify-between gap-4 shadow-sm cursor-pointer hover:scale-[1.005] active:scale-[0.995] duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          alt={session.studentName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200/50 dark:border-slate-900"
                          src={session.studentPhoto}
                        />
                        <div>
                          <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">{session.studentName}</h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">{session.type} • {session.meetingPoint}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                          session.status === "Confirmada" ? "bg-blue-50 text-blue-650 border border-blue-100/55 dark:bg-blue-950/30 dark:text-blue-400" :
                          session.status === "Concluída" ? "bg-emerald-50 text-emerald-700 border border-emerald-100/55 dark:bg-emerald-950/30 dark:text-emerald-400" :
                          session.status === "Cancelada" ? "bg-red-50 text-red-700 border border-red-100/55 dark:bg-red-950/30 dark:text-red-400" :
                          session.status === "Em andamento" ? "bg-blue-50 text-blue-700 border border-blue-100 animate-pulse dark:bg-blue-950/30 dark:text-blue-400" :
                          "bg-amber-50 text-amber-700 border border-amber-100/55 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}>
                          {session.status}
                        </span>
                        <svg className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                  <div key={slot} className="flex gap-3.5 items-center opacity-50 select-none">
                    <div className="w-14 text-right flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-400">{slot}</span>
                      <span className="text-[8px] text-slate-350 font-bold uppercase tracking-wider">Fechado</span>
                    </div>
                    <div className="w-px h-10 bg-slate-100 dark:bg-slate-900 relative">
                      <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-white dark:border-slate-950" />
                    </div>
                    <div className="flex-1 py-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl text-left text-[10px] text-slate-400 font-semibold flex items-center justify-between border border-slate-100/40">
                      <span>Fora do Expediente ({workStart} - {workEnd})</span>
                      <svg className="w-4 h-4 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                );
              }

              if (isLunch) {
                return (
                  <div key={slot} className="flex gap-3.5 items-center select-none">
                    <div className="w-14 text-right flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-450">{slot}</span>
                      <span className="text-[8px] text-slate-355 font-bold uppercase tracking-wider">Almoço</span>
                    </div>
                    <div className="w-px h-10 bg-blue-100 dark:bg-blue-900/60 relative">
                      <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-blue-200 dark:bg-blue-900 border border-white dark:border-slate-950" />
                    </div>
                    <div className="flex-1 py-2.5 px-4 bg-blue-50/20 dark:bg-blue-950/10 border border-dashed border-blue-100/60 dark:border-blue-900/40 rounded-xl text-left text-[10px] text-blue-750 dark:text-blue-400 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-550" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                        </svg>
                        Intervalo ({lunchStart} - {lunchEnd})
                      </span>
                      <span className="text-[8px] text-blue-650 bg-blue-100/60 dark:bg-blue-900/30 px-2 py-0.5 rounded-full font-black tracking-wider uppercase">Pausa</span>
                    </div>
                  </div>
                );
              }

              // Empty slot (schedulable)
              return (
                <div key={slot} className="flex gap-3.5 items-center group">
                  {/* Time label */}
                  <div className="w-14 text-right flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-400">{slot}</span>
                    <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider">Livre</span>
                  </div>

                  {/* Divider line */}
                  <div className="w-px h-10 bg-slate-100 dark:bg-slate-900 relative">
                    <div className="absolute top-4 -left-1 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-white dark:border-slate-950 group-hover:bg-blue-400 transition-colors" />
                  </div>

                  {/* Empty container */}
                  <button
                    onClick={() => {
                      setClassTime(slot);
                      setShowAddModal(true);
                    }}
                    className="flex-1 py-2.5 px-4 border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-200/80 hover:bg-blue-50/10 dark:hover:bg-blue-950/20 text-left text-xs text-slate-400 dark:text-slate-500 font-medium transition-all active:scale-[0.995] duration-150 flex items-center justify-between cursor-pointer rounded-xl"
                  >
                    <span>Disponível para Agendamento</span>
                    <span className="text-blue-600 dark:text-blue-500 font-bold hover:underline flex items-center gap-0.5 text-[10px]">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
      {showAddModal && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full relative animate-scale-up">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-5 pb-3 border-b border-slate-100 dark:border-slate-850">
              Reservar Horário: {classTime}
            </h3>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="selectedStudent" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Selecione o Aluno</Label>
                <div className="mt-1">
                  <select
                    id="selectedStudent"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-slate-700 transition-colors duration-200 cursor-pointer font-medium"
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
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-slate-700 transition-colors duration-200 cursor-pointer font-medium"
                  >
                    <option value="Aula de Baliza">Aula de Baliza</option>
                    <option value="Prática de Direção">Prática de Direção</option>
                    <option value="Percurso de Exame">Percurso de Exame</option>
                  </select>
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
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs h-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2 rounded-xl uppercase tracking-wider text-[10px]"
              >
                Confirmar Reserva
              </Button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Appointment Detail Bottom-Drawer Modal */}
      {selectedClass && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/40 dark:border-slate-800/85 relative animate-scale-up flex flex-col gap-5 max-h-[90vh] md:max-h-none overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClassId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">Detalhes da Aula</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Ficha de acompanhamento operacional</p>
            </div>

            {/* Student card info */}
            <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/30 dark:border-slate-900 rounded-xl">
              <img
                alt={selectedClass.studentName}
                className="w-12 h-12 rounded-full object-cover border border-blue-600/20"
                src={selectedClass.studentPhoto}
              />
              <div>
                <h4 className="font-bold text-slate-850 dark:text-slate-250 text-xs leading-none">{selectedClass.studentName}</h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="bg-blue-50/80 text-blue-650 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/50 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Aula 14 de 20
                  </span>
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase">Cat. B</span>
                </div>
              </div>
            </div>

            {/* Bento Grid Lesson Parameters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date & Time */}
              <div className="col-span-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/30 dark:border-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Data</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {new Date(selectedClass.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Horário</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedClass.duration}</span>
                </div>
              </div>

              {/* Class Type */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/30 dark:border-slate-900 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[8px] font-bold uppercase tracking-wider">Tipo de Aula</span>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedClass.type}</p>
              </div>

              {/* Meeting Point */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/30 dark:border-slate-900 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-[8px] font-bold uppercase tracking-wider">Local</span>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{selectedClass.meetingPoint}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/30 dark:border-slate-900">
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Anotações do Instrutor</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
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
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.15)] text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Concluir Aula Prática
                </button>
              )}

              {selectedClass.status === "Concluída" && (
                <div className="text-center p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900 rounded-xl">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <svg className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                    className="font-bold text-xs text-red-655 hover:text-red-755 py-2 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                  >
                    Cancelar Aula
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
