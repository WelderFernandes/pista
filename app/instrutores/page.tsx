"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { Header } from "@/components/header";
import { 
  MagnifyingGlass, 
  Funnel, 
  MapPin, 
  CaretLeft, 
  CaretRight, 
  Star, 
  Clock, 
  CalendarBlank,
  User,
  Phone,
  Tag,
  Circle,
  Sparkle
} from "@phosphor-icons/react";

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
}

export default function InstructorsPage() {
  const { settings, classes, addClass } = useApp();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [maxPrice, setMaxPrice] = useState(150);
  const [maxRadius, setMaxRadius] = useState(25);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // 2 instructors per page to show pagination

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, maxPrice, maxRadius]);

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

  // Resolve dynamic values for Carlos Eduardo from settings context
  const activeInstructor: Instructor = {
    id: "carlos-eduardo",
    name: "Carlos Eduardo",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYkqb9Ie4QMBVCOXtW103-nVJFRxnfLyYsXAdoW5LjFBVUJ5WvYfPD-WmNFSWCBQ56SHtHrdBMS5JJjbjEOssIm509LQ94Tf1sEyq1AjB6Xs0x7MiU503Y27oCDXn2U3pbzeicE8_NzeD8r9_L12fczcNrM_pDT5JakUXAINc4pvLuhsbRN3QXAjHbq1fAWgcx3wtqF9oPndL948bucCmG-u5xQ6QM6RfqZPlU_yKfVPf4WA9uwowtGrnu8UJs5Asbe3u1jP1DH7k",
    rating: 4.9,
    reviewsCount: 48,
    city: settings?.city || "São Paulo",
    neighborhoods: settings?.neighborhoods || ["Centro", "Pinheiros", "Vila Madalena", "Jardins"],
    meetingPoints: settings?.meetingPoints || ["Centro Comercial", "Estação de Metrô Pinheiros", "Shopping Boulevard"],
    hourlyRate: settings?.hourlyRate || 120,
    categories: settings?.categories || ["B"],
    bio: settings?.bio || "Instrutor credenciado com mais de 10 anos de experiência, especializado em direção defensiva e preparação para exames práticos.",
    distance: 2.4,
    workDays: settings?.workDays || [1, 2, 3, 4, 5, 6],
    workStart: settings?.workStart || "08:00",
    workEnd: settings?.workEnd || "18:00",
    lunchStart: settings?.lunchStart || "12:00",
    lunchEnd: settings?.lunchEnd || "13:30",
    extraDays: settings?.extraDays || [],
  };

  // Mocked list of other instructors
  const otherInstructors: Instructor[] = [
    {
      id: "amanda-rodrigues",
      name: "Amanda Rodrigues",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcYC49gnQHyORIvqGwE3WVPlQpEEo_2rcGqxv90gPI0UL-8cHL1jE-hr08ErRhrGyaOCnzIXFAvAu-Y23apkm4mU1oFNL7XGlQDshIjte4e-Lljs0EI4uQuth6rnfe32x5z6CxN42rOxE8KXNzUYFI3snjUmmlRKrmnJcuudKc3zvyQjnucFGgtA4kirUs22QMw7vAxhLORKCV5VXRlncOvbKeBmzvUvv5aDZcE0PC8lm8h24k-G-2zb4RmOgHHpEpaLJaupvS-aY",
      rating: 4.8,
      reviewsCount: 36,
      city: "São Paulo",
      neighborhoods: ["Pinheiros", "Butantã", "Lapa", "Perdizes"],
      meetingPoints: ["Metrô Butantã", "Praça Panamericana", "Autoescola Lapa"],
      hourlyRate: 110,
      categories: ["A", "B"],
      bio: "Especialista em alunos com ansiedade e medo de dirigir. Paciência e didática focada no ritmo do aluno.",
      distance: 5.1,
      workDays: [1, 2, 3, 4, 5],
      workStart: "09:00",
      workEnd: "17:00",
      lunchStart: "12:00",
      lunchEnd: "13:00",
      extraDays: [],
    },
    {
      id: "roberto-silva",
      name: "Roberto Silva",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
      rating: 4.7,
      reviewsCount: 24,
      city: "Campinas",
      neighborhoods: ["Cambuí", "Guanabara", "Taquaral", "Centro"],
      meetingPoints: ["Lagoa do Taquaral", "Largo do Pará"],
      hourlyRate: 95,
      categories: ["B", "C", "D"],
      bio: "Ampla experiência em veículos de grande porte. Aulas práticas para categorias profissionais C e D.",
      distance: 18.5,
      workDays: [1, 2, 3, 4, 5, 6],
      workStart: "08:00",
      workEnd: "18:00",
      lunchStart: "12:30",
      lunchEnd: "13:30",
      extraDays: [],
    },
    {
      id: "juliana-mendes",
      name: "Juliana Mendes",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXI6m_H1FJGSYFqoFQmc2TkCWx-gBC6HiGsXCQUA8yrATa1IzKcZbryflfWubUVop34t_FPqEP1Cj-gU3lezS7CHv7nsQ_dkiu5A9VSNDcq8MtcfE8q_EpTNXfkTR7qy-UTYoT_k6vsLcnliZBqHfFDbwzIynUGp5j6OuHlsptpv4C3p6Am5FywHlkyEBgZfsDxMtI0ymOORILUOfRuReR7FDYw8R9BcnGrcDpeb9aaRd6yf19SkgyqmTrccyeItntzQeIGA3_fDc",
      rating: 5.0,
      reviewsCount: 52,
      city: "São Paulo",
      neighborhoods: ["Santo Amaro", "Brooklin", "Itaim Bibi", "Morumbi"],
      meetingPoints: ["Shopping Morumbi", "Estação Brooklin", "Autoescola Santo Amaro"],
      hourlyRate: 130,
      categories: ["A"],
      bio: "Instrutora de pilotagem de motocicletas com foco em segurança urbana e técnicas avançadas de curvas.",
      distance: 9.7,
      workDays: [2, 3, 4, 5, 6],
      workStart: "08:00",
      workEnd: "15:00",
      lunchStart: "11:30",
      lunchEnd: "12:30",
      extraDays: [],
    },
  ];

  const allInstructors = [activeInstructor, ...otherInstructors];

  // Filtering Logic
  const filteredInstructors = allInstructors.filter((inst) => {
    const matchesSearch =
      searchQuery === "" ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.neighborhoods.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "TODAS" || inst.categories.includes(selectedCategory);

    const matchesPrice = inst.hourlyRate <= maxPrice;
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

    const isOccupied = classes.some(
      (c) => c.date === date && c.time === slot && c.instructorName === instructor.name && c.status !== "Cancelada"
    );

    return {
      isWorking: true,
      isOutside,
      isLunch,
      isOccupied,
    };
  };

  const timeSlots = ["08:00", "09:40", "11:20", "14:00", "15:40", "17:20", "19:00"];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !selectedSlot || !selectedInstructor) {
      alert("Por favor, preencha todos os campos e selecione um horário.");
      return;
    }

    const duration = `${selectedSlot} - ${calculateEndTime(selectedSlot)}`;

    addClass({
      studentId: `guest-${Date.now()}`,
      studentName: bookingName,
      studentPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0dVE5Ook3028s84NS2xR72gOa8NLCpcAjTIQCIJJagtsW47vItwX-4ELXMzWTDo-ugiktO3_1ybUjSePZ6mzFRnLdT6PpunhJB-P-WC6jYR-v6oW-OFX63304dI4LfqITuW2AwVaLyI3qms9_K812TSju4FYIcaJD6hzv9dYBDHr_8VdWbYmfjx79apTjo4YciQxwLSlY4pCSEZaUy9T8o5xUAUobs610jcXUCUAr9V-1OUEa5cB5kU2_pr3HhOFdu3jdqrX99yc",
      type: `Aula Prática (Cat. ${bookingCategory})`,
      date: selectedDate,
      time: selectedSlot,
      duration: duration,
      meetingPoint: bookingMeetingPoint,
      instructorName: selectedInstructor.name,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedInstructor(null);
      setBookingName("");
      setBookingPhone("");
      setSelectedSlot(null);
      setBookingSuccess(false);
    }, 4000);
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-x-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#020617)] z-0" />
        {/* Animated grid lines pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 z-0 animate-pulse-slow" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-6 animate-float">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Nossos Profissionais de Elite</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 animate-fade-in-up">
            Escolha seu Instrutor
          </h2>
          <p className="text-slate-400 mt-6 text-sm md:text-lg max-w-2xl leading-relaxed animate-fade-in-up delay-100">
            Agende suas aulas práticas de forma totalmente digital. Filtre por localização, preço, categoria de habilitação e encontre a melhor combinação para seu aprendizado.
          </p>
        </div>
      </section>

      {/* Main Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 z-10">
        
        {/* Bento Box Search Filters */}
        <section className="mb-10 animate-fade-in-up delay-200">
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 mb-6">
              <Funnel className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-white">Refinar Pesquisa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Query search */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Cidade, Bairro ou Nome</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Amanda, Pinheiros, São Paulo..."
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500/60 focus:bg-slate-950 transition-all duration-300"
                  />
                  <MagnifyingGlass className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Categoria Habilitação</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500/60 focus:bg-slate-950 transition-all duration-300"
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
                className="bg-slate-950/45 hover:bg-slate-950 text-slate-400 hover:text-white font-bold text-xs py-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer h-10 flex items-center justify-center"
              >
                Limpar Filtros
              </button>

              {/* Price range */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <span>Valor Máximo por Aula</span>
                  <span className="text-orange-400 font-semibold">R$ {maxPrice} / 50min</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Distance range */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <span>Distância Máxima</span>
                  <span className="text-orange-400 font-semibold">{maxRadius} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0 animate-fade-in-up delay-300">
          <p className="text-xs text-slate-400">
            Encontramos <strong className="text-slate-200">{filteredInstructors.length}</strong> instrutores qualificados
          </p>
          {totalPages > 1 && (
            <p className="text-[10px] text-slate-500">
              Página {currentPage} de {totalPages}
            </p>
          )}
        </div>

        {/* Instructors Grid */}
        {currentInstructors.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl animate-fade-in-up delay-300">
            <svg className="w-12 h-12 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-bold text-slate-400 text-lg">Nenhum instrutor atende a esses filtros</h4>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">Tente reajustar os controles deslizantes de preço e distância ou pesquise por outro bairro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-300">
            {currentInstructors.map((inst) => (
              <div 
                key={inst.id}
                className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 hover:border-orange-500/35 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 relative overflow-hidden group hover:bg-slate-900/30"
              >
                {/* Distance Badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1 text-[9px] font-bold bg-slate-950/80 border border-slate-850 px-2.5 py-1 rounded-full text-slate-400 backdrop-blur-sm">
                  <MapPin className="w-3 h-3 text-orange-500 animate-pulse" />
                  <span>{inst.distance} km de distância</span>
                </div>

                {/* Profile Information */}
                <div className="flex gap-5 items-start">
                  <img
                    alt={inst.name}
                    src={inst.photo}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-lg text-white truncate leading-snug group-hover:text-orange-400 transition-colors duration-300">{inst.name}</h4>
                    
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
                      <span className="text-xs font-bold text-slate-200">{inst.rating}</span>
                      <span className="text-[10px] text-slate-500">({inst.reviewsCount} avaliações)</span>
                    </div>

                    {/* Categoria Tags */}
                    <div className="flex gap-1.5 mt-3">
                      {inst.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[9px] font-black px-2.5 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase tracking-wider"
                        >
                          Cat. {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-850 pl-3">
                  "{inst.bio}"
                </p>

                {/* Location Grid Details */}
                <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-950/40 p-4 rounded-xl border border-slate-900/60">
                  <div className="flex flex-col gap-1.5 border-r border-slate-900/80 pr-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold">Cidade / Bairros</span>
                    <p className="text-slate-300 font-semibold truncate" title={inst.neighborhoods.join(", ")}>
                      {inst.city} — {inst.neighborhoods.join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold">Pontos de Encontro</span>
                    <p className="text-slate-300 font-semibold truncate" title={inst.meetingPoints.join(", ")}>
                      {inst.meetingPoints.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Footer and CTA */}
                <div className="flex justify-between items-center border-t border-slate-850 pt-5 mt-2">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Valor da Aula</span>
                    <span className="text-xl font-black text-white">
                      R$ {inst.hourlyRate} <span className="text-xs font-normal text-slate-400">/ 50min</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(inst)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center gap-2"
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                  className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" 
                      : "border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <CaretRight className="w-4 h-4" />
            </button>
          </section>
        )}
      </main>

      {/* Booking Calendar Dialog Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded-full cursor-pointer z-10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl font-bold animate-bounce">
                  ✓
                </div>
                <h4 className="font-extrabold text-white text-lg">Solicitação Enviada com Sucesso!</h4>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 text-left w-full text-xs flex flex-col gap-2">
                  <p><span className="text-slate-500 font-bold">Instrutor:</span> <span className="text-slate-300 font-semibold">{selectedInstructor.name}</span></p>
                  <p><span className="text-slate-500 font-bold">Horário Solicitado:</span> <span className="text-orange-500 font-extrabold">{selectedDate.split("-").reverse().join("/")} às {selectedSlot}</span></p>
                  <p><span className="text-slate-500 font-bold">Ponto de Encontro:</span> <span className="text-slate-300 font-semibold">{bookingMeetingPoint}</span></p>
                  <p><span className="text-slate-500 font-bold">Status do Agendamento:</span> <span className="text-yellow-650 bg-yellow-555/10 px-2 py-0.5 rounded font-extrabold border border-yellow-500/20 uppercase text-[9px]">Pendente de Aprovação</span></p>
                </div>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  A solicitação foi adicionada ao painel do instrutor. Ele entrará em contato via WhatsApp no número <strong className="text-slate-200">{bookingPhone}</strong> para confirmar a aula.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div>
                  <h4 className="font-extrabold text-white text-lg">Agenda de {selectedInstructor.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Selecione uma data e horário livre para fazer a solicitação.</p>
                </div>

                {/* Horizontal Date Selector */}
                <div className="border-y border-slate-800/60 py-3">
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
                          className={`py-2 px-3 min-w-[54px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-95 cursor-pointer snap-center ${
                            isSelected
                              ? "bg-orange-600 text-white font-bold shadow-md shadow-orange-600/20"
                              : "bg-slate-950 text-slate-400 hover:bg-slate-850 hover:text-white"
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
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3">Horários Disponíveis</span>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const details = getSlotDetails(selectedInstructor, selectedDate, slot);

                      if (!details.isWorking) {
                        return null;
                      }

                      const isSelected = selectedSlot === slot;
                      const isLocked = details.isOutside || details.isLunch || details.isOccupied;

                      let label = slot;
                      let btnStyle = "bg-slate-950 border border-slate-850 text-slate-300 hover:border-orange-500/40 hover:text-white";
                      
                      if (details.isLunch) {
                        label = "Almoço";
                        btnStyle = "bg-orange-955/20 border border-orange-955/30 text-orange-650/75 cursor-not-allowed text-[10px]";
                      } else if (details.isOutside) {
                        label = "Fechado";
                        btnStyle = "bg-slate-955 opacity-40 border border-slate-955 text-slate-600 cursor-not-allowed text-[10px]";
                      } else if (details.isOccupied) {
                        label = "Ocupado";
                        btnStyle = "bg-red-955/20 border border-red-955/30 text-red-500/75 cursor-not-allowed text-[10px]";
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
                            !isLocked ? "active:scale-95 hover:scale-[1.02]" : ""
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
                        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
                          <span className="text-[11px] text-slate-500 font-semibold block">Dia de folga do instrutor</span>
                          <span className="text-[9px] text-slate-600 block mt-0.5">Selecione outro dia da semana.</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Form fields only visible when a slot is chosen */}
                {selectedSlot && (
                  <form onSubmit={handleConfirmBooking} className="flex flex-col gap-4 border-t border-slate-850 pt-4 animate-fade-in-up">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Reserva de Slot: <strong className="text-orange-500">{selectedDate.split("-").reverse().join("/")} às {selectedSlot}</strong>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-1 font-bold uppercase">Seu Nome</label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Ex: Pedro Silva"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-400 block mb-1 font-bold uppercase">WhatsApp</label>
                        <input
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="Ex: (11) 99999-9999"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-1 font-bold uppercase">Categoria</label>
                        <select
                          value={bookingCategory}
                          onChange={(e) => setBookingCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                        >
                          {selectedInstructor.categories.map((c) => (
                            <option key={c} value={c}>
                              Categoria {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-400 block mb-1 font-bold uppercase">Ponto de Encontro</label>
                        <select
                          value={bookingMeetingPoint}
                          onChange={(e) => setBookingMeetingPoint(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                        >
                          {selectedInstructor.meetingPoints.map((mp) => (
                            <option key={mp} value={mp}>
                              {mp}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl shadow-lg mt-1 text-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Enviar Solicitação de Agendamento
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-6 text-slate-650 text-[10px] z-10 border-t border-slate-900 bg-slate-950 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-4 sm:gap-0">
        <span className="text-slate-500 font-medium">Volante Certo S.A. &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-6 text-slate-400 font-medium">
          <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Termos de Uso</Link>
          <Link href="/termos" className="hover:text-white transition-colors">Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
