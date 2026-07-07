"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  MagnifyingGlass, 
  Funnel, 
  MapPin, 
  CaretLeft, 
  CaretRight, 
  Star, 
  CalendarBlank,
  Sparkle
} from "@phosphor-icons/react";
import { Header } from "@/components/header";
import { formatCentsToBRL, centsToBRL } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstructorsFilterStore } from "@/lib/store-instructors";
import { getPublicInstructors, addPublicClassAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";



interface Instructor {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  city: string;
  neighborhoods: string[];
  meetingPoints: string[];
  hourlyRate: number;
  categories: string[];
  bio: string;
  distance: number;
  workDays: number[];
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  extraDays: { date: string; start: string; end: string }[];
  classes?: { date: string; time: string; instructorName: string }[];
}


export default function InstructorsPage() {
  const queryClient = useQueryClient();

  // Zustand state and filters
  const {
    searchQuery,
    selectedCategory,
    maxPrice,
    maxRadius,
    currentPage,
    setSearchQuery,
    setSelectedCategory,
    setMaxPrice,
    setMaxRadius,
    setCurrentPage,
    resetFilters,
  } = useInstructorsFilterStore();

  const itemsPerPage = 2; // 2 instructors per page to show pagination

  // TanStack Query to fetch public instructors from the database
  const { data: dbInstructors = [], isLoading } = useQuery<Instructor[]>({
    queryKey: ["public-instructors"],
    queryFn: () => getPublicInstructors() as unknown as Promise<Instructor[]>,
  });

  // Booking Modal states
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingCategory, setBookingCategory] = useState("");
  const [bookingMeetingPoint, setBookingMeetingPoint] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (selectedInstructor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedInstructor]);

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

  // Filtering Logic
  const filteredInstructors = dbInstructors.filter((inst) => {
    const matchesSearch =
      searchQuery === "" ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.neighborhoods.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "TODAS" || inst.categories.includes(selectedCategory);

    const matchesPrice = centsToBRL(inst.hourlyRate) <= maxPrice;
    const matchesRadius = inst.distance <= maxRadius;

    return matchesSearch && matchesCategory && matchesPrice && matchesRadius;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInstructors = filteredInstructors.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenBooking = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setSelectedSlot(null);
    setBookingCategory(instructor.categories[0] || "B");
    setBookingMeetingPoint(instructor.meetingPoints[0] || "");
    setBookingSuccess(false);
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

  const getSlotDetails = (instructor: Instructor, date: string, slot: string) => {
    const extraDayConfig = instructor.extraDays?.find((ed) => ed.date === date);
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    const isNormalWorkDay = instructor.workDays.includes(dayOfWeek);
    const isWorking = !!extraDayConfig || isNormalWorkDay;

    if (!isWorking) {
      return { isWorking: false, status: "folga" };
    }

    const start = extraDayConfig ? extraDayConfig.start : instructor.workStart;
    const end = extraDayConfig ? extraDayConfig.end : instructor.workEnd;
    const lunchStart = instructor.lunchStart;
    const lunchEnd = instructor.lunchEnd;

    const slotEnd = calculateEndTime(slot);
    const isOutside = slot < start || slot >= end;
    const isLunch = !extraDayConfig && ((slot >= lunchStart && slot < lunchEnd) || (slotEnd > lunchStart && slotEnd <= lunchEnd));

    const isOccupied = instructor.classes?.some(
      (c) => c.date === date && c.time === slot && c.instructorName === instructor.name
    );

    return {
      isWorking: true,
      isOutside,
      isLunch,
      isOccupied: !!isOccupied,
    };
  };

  const timeSlots = ["08:00", "09:40", "11:20", "14:00", "15:40", "17:20", "19:00"];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !selectedSlot || !selectedInstructor) {
      alert("Por favor, preencha todos os campos e selecione um horário.");
      return;
    }

    const duration = `${selectedSlot} - ${calculateEndTime(selectedSlot)}`;

    try {
      await addPublicClassAction({
        organizationId: selectedInstructor.id,
        studentName: bookingName,
        studentPhone: bookingPhone,
        date: selectedDate,
        time: selectedSlot,
        duration: duration,
        meetingPoint: bookingMeetingPoint,
        type: `Aula Prática (Cat. ${bookingCategory})`,
        instructorName: selectedInstructor.name,
      });

      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["public-instructors"] });

      setTimeout(() => {
        setSelectedInstructor(null);
        setBookingName("");
        setBookingPhone("");
        setSelectedSlot(null);
        setBookingSuccess(false);
      }, 4000);
    } catch (error) {
      const err = error as Error;
      alert(err?.message || "Erro ao realizar o agendamento. Verifique os dados inseridos.");
    }
  };


  useEffect(() => {
    if (selectedInstructor) {
      const activeEl = document.getElementById(`modal-date-btn-${selectedDate}`);
      if (activeEl && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const leftPos = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: leftPos, behavior: "smooth" });
      }
    }
  }, [selectedDate, selectedInstructor]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col justify-between relative overflow-x-hidden font-sans transition-colors duration-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 border-b border-slate-200 dark:border-slate-900 transition-colors">
        <div className="absolute inset-0 bg-[radial-linear(ellipse_at_center,transparent_20%,#020617)] z-0 hidden dark:block" />
        {/* Animated grid lines pattern */}
        <div className="absolute inset-0 bg-[linear-linear(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-linear(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] dark:bg-[linear-linear(to_right,#0f172a_1px,transparent_1px),linear-linear(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-linear(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 z-0 animate-pulse-slow" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-6 animate-float">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Nossos Profissionais de Elite</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-r from-slate-950 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 animate-fade-in-up">
            Escolha seu Instrutor
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-6 text-sm md:text-lg max-w-2xl leading-relaxed animate-fade-in-up delay-100">
            Agende suas aulas práticas de forma totalmente digital. Filtre por localização, preço, categoria de habilitação e encontre a melhor combinação para seu aprendizado.
          </p>
        </div>
      </section>

      {/* Main Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 z-10">
        
        {/* Bento Box Search Filters */}
        <section className="mb-10 animate-fade-in-up delay-200">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl dark:bg-slate-900/30 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <Funnel className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Refinar Pesquisa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Query search */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Cidade, Bairro ou Nome</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Amanda, Pinheiros, São Paulo..."
                    className="w-full bg-white border border-slate-200 text-slate-850 dark:bg-slate-950/60 dark:border-slate-800/80 dark:text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600/60 transition-all duration-300 shadow-xs"
                  />
                  <MagnifyingGlass className="w-4 h-4 text-slate-450 dark:text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Categoria Habilitação</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-850 dark:bg-slate-950/60 dark:border-slate-800/80 dark:text-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-600/60 transition-all duration-300 shadow-xs"
                >
                  <option value="TODAS">Todas as Categorias</option>
                  <option value="A">Moto (Cat. A)</option>
                  <option value="B">Carro (Cat. B)</option>
                  <option value="C">Caminhão (Cat. C)</option>
                  <option value="D">Ônibus (Cat. D)</option>
                </select>
              </div>

              {/* Clear filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("TODAS");
                  setMaxPrice(150);
                  setMaxRadius(25);
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-950/45 dark:hover:bg-slate-950 dark:text-slate-400 dark:hover:text-white dark:border-slate-800/80 rounded-xl font-bold text-xs py-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer h-10 flex items-center justify-center shadow-xs"
              >
                Limpar Filtros
              </button>

              {/* Price range */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  <span>Valor Máximo por Aula</span>
                  <span className="text-blue-600 dark:text-blue-450 font-semibold">R$ {maxPrice} / 50min</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-xl appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Distance range */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  <span>Distância Máxima</span>
                  <span className="text-blue-600 dark:text-blue-450 font-semibold">{maxRadius} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-xl appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0 animate-fade-in-up delay-300">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Encontramos <strong className="text-slate-800 dark:text-slate-200">{filteredInstructors.length}</strong> instrutores qualificados
          </p>
          {totalPages > 1 && (
            <p className="text-[10px] text-slate-500">
              Página {currentPage} de {totalPages}
            </p>
          )}
        </div>

        {/* Instructors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((idx) => (
              <div 
                key={idx}
                className="bg-slate-50/50 border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/80 rounded-2xl p-6 h-[290px] flex flex-col justify-between animate-pulse"
              >
                <div className="flex gap-5 items-start">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : currentInstructors.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 dark:bg-slate-900/10 dark:border-slate-900 rounded-xl animate-fade-in-up delay-300">
            <svg className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-bold text-slate-500 dark:text-slate-400 text-lg">Nenhum instrutor atende a esses filtros</h4>
            <p className="text-xs text-slate-550 dark:text-slate-500 mt-1.5 max-w-sm mx-auto">Tente reajustar os controles deslizantes de preço e distância ou pesquise por outro bairro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-300">
            {currentInstructors.map((inst) => (
              <div 
                key={inst.id}
                className="bg-white border border-slate-200 dark:bg-slate-900/20 dark:border-slate-800/80 rounded-2xl p-6 hover:border-blue-600/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 relative overflow-hidden group hover:bg-slate-50/5 dark:hover:bg-slate-900/30 shadow-sm"
              >
                {/* Distance Badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1 text-[9px] font-bold bg-slate-50 border border-slate-200 text-slate-600 dark:bg-slate-950/80 dark:border-slate-850 dark:text-slate-400 px-2.5 py-1 rounded-xl backdrop-blur-sm shadow-xs">
                  <MapPin className="w-3 h-3 text-blue-500 animate-pulse" />
                  <span>{inst.distance} km de distância</span>
                </div>

                {/* Profile Information */}
                <div className="flex gap-5 items-start">
                  <Image
                    alt={inst.name}
                    src={inst.photo}
                    width={100}
                    height={100}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white truncate leading-snug group-hover:text-blue-600 dark:group-hover:text-orange-400 transition-colors duration-300">{inst.name}</h4>
                    
                    {/* Stars and reviews */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            weight={i < Math.floor(inst.rating) ? "fill" : "regular"}
                            className="w-3.5 h-3.5"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{inst.rating}</span>
                      <span className="text-[10px] text-slate-500">({inst.reviewsCount} avaliações)</span>
                    </div>

                    {/* Categoria Tags */}
                    <div className="flex gap-1.5 mt-3">
                      {inst.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[9px] font-black px-2.5 py-0.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-blue-600 dark:text-blue-450 uppercase tracking-wider"
                        >
                          Cat. {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-850 pl-3">
                  &ldquo;{inst.bio}&rdquo;
                </p>

                {/* Location Grid Details */}
                <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 border border-slate-200 dark:bg-slate-950/40 dark:border-slate-900/60 p-4 rounded-2xl shadow-xs">
                  <div className="flex flex-col gap-1.5 border-r border-slate-200 dark:border-slate-900/80 pr-2">
                    <span className="text-[9px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-extrabold">Cidade / Bairros</span>
                    <p className="text-slate-800 dark:text-slate-300 font-semibold truncate" title={inst.neighborhoods.join(", ")}>
                      {inst.city} — {inst.neighborhoods.join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-2">
                    <span className="text-[9px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-extrabold">Pontos de Encontro</span>
                    <p className="text-slate-800 dark:text-slate-300 font-semibold truncate" title={inst.meetingPoints.join(", ")}>
                      {inst.meetingPoints.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Footer and CTA */}
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-850 pt-5 mt-2">
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-bold block">Valor da Aula</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {formatCentsToBRL(inst.hourlyRate)} <span className="text-xs font-normal text-slate-550 dark:text-slate-400">/ 50min</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(inst)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center gap-2"
                  >
                    <CalendarBlank className="w-4 h-4 animate-float" />
                    Reservar Horário
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <section className="flex justify-center items-center gap-3 mt-12 animate-fade-in-up">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <CaretLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isSelected = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                    isSelected 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <CaretRight className="w-4 h-4" />
            </button>
          </section>
        )}
      </main>

      {/* Booking Calendar Dialog Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 text-slate-900 dark:text-white transition-colors duration-300">
            <button
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full cursor-pointer z-10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold animate-bounce">
                  ✓
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Solicitação Enviada com Sucesso!</h4>
                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-850 text-left w-full text-xs flex flex-col gap-2 shadow-xs">
                  <p><span className="text-slate-500 font-bold">Instrutor:</span> <span className="text-slate-800 dark:text-slate-300 font-semibold">{selectedInstructor.name}</span></p>
                  <p><span className="text-slate-500 font-bold">Horário Solicitado:</span> <span className="text-blue-600 dark:text-blue-500 font-extrabold">{selectedDate.split("-").reverse().join("/")} às {selectedSlot}</span></p>
                  <p><span className="text-slate-500 font-bold">Ponto de Encontro:</span> <span className="text-slate-800 dark:text-slate-300 font-semibold">{bookingMeetingPoint}</span></p>
                  <p><span className="text-slate-500 font-bold">Status do Agendamento:</span> <span className="text-yellow-600 dark:text-yellow-650 bg-yellow-500/10 dark:bg-yellow-555/10 px-2 py-0.5 rounded font-extrabold border border-yellow-500/20 dark:border-yellow-500/20 uppercase text-[9px]">Pendente de Aprovação</span></p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  A solicitação foi adicionada ao painel do instrutor. Ele entrará em contato via WhatsApp no número <strong className="text-slate-800 dark:text-slate-200">{bookingPhone}</strong> para confirmar a aula.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Agenda de {selectedInstructor.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Selecione uma data e horário livre para fazer a solicitação.</p>
                </div>

                {/* Horizontal Date Selector */}
                <div className="border-y border-slate-200 dark:border-slate-800/60 py-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Junho de 2026</span>
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
                          id={`modal-date-btn-${d.dateStr}`}
                          onClick={() => {
                            setSelectedDate(d.dateStr);
                            setSelectedSlot(null);
                          }}
                          className={`py-2 px-3 min-w-[54px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-95 cursor-pointer snap-center shadow-xs ${
                            isSelected
                              ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                              : "bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-850 dark:hover:bg-slate-850 dark:hover:text-white"
                          }`}
                        >
                          <span className="text-[9px] uppercase font-medium">{d.day}</span>
                          <span className="text-sm font-extrabold">{d.num}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots List Grid */}
                <div>
                  <span className="text-[10px] text-slate-550 dark:text-slate-500 font-bold uppercase tracking-wider block mb-3">Horários Disponíveis</span>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const details = getSlotDetails(selectedInstructor, selectedDate, slot);

                      if (!details.isWorking) {
                        return null;
                      }

                      const isSelected = selectedSlot === slot;
                      const isLocked = details.isOutside || details.isLunch || details.isOccupied;

                      let label = slot;
                      let btnStyle = "bg-slate-50 border border-slate-200 text-slate-700 hover:border-orange-500/40 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300 dark:hover:border-orange-500/40 dark:hover:text-white";
                      
                      if (details.isLunch) {
                        label = "Almoço";
                        btnStyle = "bg-orange-50 border border-orange-100 text-blue-600/60 dark:bg-orange-955/20 dark:border-orange-955/30 dark:text-rose-500/75 cursor-not-allowed text-[10px]";
                      } else if (details.isOutside) {
                        label = "Fechado";
                        btnStyle = "bg-slate-100 opacity-40 border border-slate-200 text-slate-500 dark:bg-slate-955 dark:opacity-40 dark:border-slate-955 dark:text-slate-600 cursor-not-allowed text-[10px]";
                      } else if (details.isOccupied) {
                        label = "Ocupado";
                        btnStyle = "bg-red-50 border border-red-100 text-red-600/60 dark:bg-red-955/20 dark:border-red-955/30 dark:text-red-500/75 cursor-not-allowed text-[10px]";
                      } else if (isSelected) {
                        btnStyle = "bg-orange-600 border border-orange-600 text-white font-extrabold shadow-sm";
                      }

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isLocked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 rounded-xl text-center text-xs font-bold transition-all duration-300 ${
                            !isLocked ? "active:scale-95 hover:scale-[1.02] cursor-pointer" : ""
                          } ${btnStyle}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Day off */}
                  {(() => {
                    const extraDayConfig = selectedInstructor.extraDays?.find((ed) => ed.date === selectedDate);
                    const dayOfWeek = new Date(selectedDate + "T00:00:00").getDay();
                    const isNormalWorkDay = selectedInstructor.workDays.includes(dayOfWeek);
                    const isWorking = !!extraDayConfig || isNormalWorkDay;
                    
                    if (!isWorking) {
                      return (
                        <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/30">
                          <span className="text-[11px] text-slate-500 dark:text-slate-500 font-semibold block">Dia de folga do instrutor</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-650 block mt-0.5">Selecione outro dia da semana.</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Form fields only visible when a slot is chosen */}
                {selectedSlot && (
                  <form onSubmit={handleConfirmBooking} className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-850 pt-4 animate-fade-in-up">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider">
                      Reserva de Slot: <strong className="text-rose-500 dark:text-blue-500">{selectedDate.split("-").reverse().join("/")} às {selectedSlot}</strong>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="bookingName" className="text-[9px]">Seu Nome</Label>
                        <div className="mt-1">
                          <Input
                            type="text"
                            id="bookingName"
                            required
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            placeholder="Ex: Pedro Silva"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bookingPhone" className="text-[9px]">WhatsApp</Label>
                        <div className="mt-1">
                          <Input
                            type="tel"
                            id="bookingPhone"
                            required
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            placeholder="Ex: (11) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="bookingCategory" className="text-[9px]">Categoria</Label>
                        <div className="mt-1">
                          <select
                            id="bookingCategory"
                            value={bookingCategory}
                            onChange={(e) => setBookingCategory(e.target.value)}
                            className="flex h-10 w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-slate-350 dark:focus:border-slate-700 transition-colors duration-200"
                          >
                            {selectedInstructor.categories.map((c) => (
                              <option key={c} value={c}>
                                Categoria {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bookingMeetingPoint" className="text-[9px]">Ponto de Encontro</Label>
                        <div className="mt-1">
                          <select
                            id="bookingMeetingPoint"
                            value={bookingMeetingPoint}
                            onChange={(e) => setBookingMeetingPoint(e.target.value)}
                            className="flex h-10 w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-slate-350 dark:focus:border-slate-700 transition-colors duration-200"
                          >
                            {selectedInstructor.meetingPoints.map((mp) => (
                              <option key={mp} value={mp}>
                                {mp}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Enviar Solicitação de Agendamento
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-6 text-slate-500 dark:text-slate-655 text-[10px] z-10 border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-4 sm:gap-0 transition-colors duration-300">
        <span className="font-medium">Pista S.A. &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-6 font-medium">
          <Link href="/politica-de-privacidade" className="hover:text-slate-850 dark:hover:text-white transition-colors">Termos de Uso</Link>
          <Link href="/termos" className="hover:text-slate-850 dark:hover:text-white transition-colors">Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
