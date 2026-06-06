"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";

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
  distance: number; // simulated distance in km
}

export default function Home() {
  const { settings } = useApp();
  const [hoveredCard, setHoveredCard] = useState<"instructor" | "student" | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [maxPrice, setMaxPrice] = useState(150);
  const [maxRadius, setMaxRadius] = useState(20);

  // Booking Modal states
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingCategory, setBookingCategory] = useState("");
  const [bookingMeetingPoint, setBookingMeetingPoint] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
    },
  ];

  const allInstructors = [activeInstructor, ...otherInstructors];

  // Filtering Logic
  const filteredInstructors = allInstructors.filter((inst) => {
    // 1. Search Query (matches city, name or neighborhoods)
    const matchesSearch =
      searchQuery === "" ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.neighborhoods.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category
    const matchesCategory =
      selectedCategory === "TODAS" || inst.categories.includes(selectedCategory);

    // 3. Price
    const matchesPrice = inst.hourlyRate <= maxPrice;

    // 4. Radius / Distance
    const matchesRadius = inst.distance <= maxRadius;

    return matchesSearch && matchesCategory && matchesPrice && matchesRadius;
  });

  const handleOpenBooking = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setBookingCategory(instructor.categories[0] || "B");
    setBookingMeetingPoint(instructor.meetingPoints[0] || "");
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedInstructor(null);
      setBookingName("");
      setBookingPhone("");
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20">
            V
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Volante Certo</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Plataforma de Direção</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">Sistema Online</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 z-10 max-w-7xl mx-auto w-full gap-12">
        <div className="text-center max-w-2xl mt-4">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider">
            Bem-vindo ao Volante Certo
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">
            Encontre o Instrutor Ideal
          </h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base">
            Gerencie suas aulas através dos portais de acesso rápidos ou busque e conecte-se com instrutores credenciados perto de você.
          </p>
        </div>

        {/* Portal Cards Selector */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Instructor Card */}
          <Link
            href="/login?profile=instructor"
            onMouseEnter={() => setHoveredCard("instructor")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border p-6 bg-slate-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[220px] overflow-hidden ${
              hoveredCard === "instructor"
                ? "border-orange-500/50 shadow-2xl shadow-orange-500/10 -translate-y-1"
                : "border-slate-800"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="z-10">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Portal do Instrutor</h3>
              <p className="text-slate-400 mt-1.5 text-xs">
                Gerencie sua agenda de aulas, configure horários de almoço, expediente e abra agendas extras.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 z-10 group-hover:translate-x-1 transition-transform mt-4">
              Acessar Painel
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Student Card */}
          <Link
            href="/login?profile=student"
            onMouseEnter={() => setHoveredCard("student")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border p-6 bg-slate-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[220px] overflow-hidden ${
              hoveredCard === "student"
                ? "border-blue-500/50 shadow-2xl shadow-blue-500/10 -translate-y-1"
                : "border-slate-800"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v6m0 0l3-3m-3 3l-3-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Portal do Aluno</h3>
              <p className="text-slate-400 mt-1.5 text-xs">
                Visualize seu cronograma de aulas práticas, verifique pagamentos pendentes e seu progresso operacional.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 z-10 group-hover:translate-x-1 transition-transform mt-4">
              Ver Meu Painel
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Discovery Search Section */}
        <section className="w-full flex flex-col gap-6 border-t border-slate-900 pt-10">
          <div className="flex flex-col gap-1.5 mb-2">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Instrutores Disponíveis
            </h3>
            <p className="text-slate-400 text-xs md:text-sm">Filtre por cidade, bairro, faixa de preço, raio de proximidade e categoria de habilitação.</p>
          </div>

          {/* Search Filters Bento Box */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Neighborhood / City Search Input */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Cidade ou Bairro</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Pinheiros, São Paulo ou Amanda..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                />
                <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Select Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="TODAS">Todas Categorias</option>
                <option value="A">Moto (A)</option>
                <option value="B">Carro (B)</option>
                <option value="C">Caminhão (C)</option>
                <option value="D">Ônibus (D)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("TODAS");
                setMaxPrice(150);
                setMaxRadius(25);
              }}
              className="bg-slate-950/40 hover:bg-slate-950 text-slate-400 hover:text-white font-bold text-xs py-3 rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              Limpar Filtros
            </button>

            {/* Price slider */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <span>Valor Máximo da Aula</span>
                <span className="text-orange-400 font-semibold">Até R$ {maxPrice}/aula</span>
              </div>
              <input
                type="range"
                min="80"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Radius slider */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <span>Raio de Busca (Distância)</span>
                <span className="text-orange-400 font-semibold">Até {maxRadius} km</span>
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

          {/* Results Count Info */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              Mostrando <strong className="text-white">{filteredInstructors.length}</strong> instrutores com os filtros aplicados
            </span>
          </div>

          {/* Instructors Grid list */}
          {filteredInstructors.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 border border-dashed border-slate-900 rounded-2xl">
              <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-bold text-slate-400">Nenhum instrutor encontrado</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Tente alterar os termos de busca ou aumentar os limites de preço e raio de distância.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInstructors.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 hover:border-orange-500/40 transition-all flex flex-col justify-between gap-5 relative overflow-hidden group"
                >
                  {/* Subtle distance pill */}
                  <span className="absolute top-4 right-4 text-[9px] font-bold bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-full text-slate-400">
                    a {inst.distance} km de você
                  </span>

                  {/* Header info */}
                  <div className="flex gap-4 items-start">
                    <img
                      alt={inst.name}
                      src={inst.photo}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-white truncate">{inst.name}</h4>
                      
                      {/* Rating details */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(inst.rating) ? "fill-current" : "stroke-current fill-none"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-300">{inst.rating}</span>
                        <span className="text-[10px] text-slate-500">({inst.reviewsCount} aulas)</span>
                      </div>

                      {/* Categories Badges */}
                      <div className="flex gap-1 mt-2">
                        {inst.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-orange-600/15 border border-orange-500/30 text-orange-400 uppercase tracking-wider"
                          >
                            Cat. {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bio Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic">
                    "{inst.bio}"
                  </p>

                  {/* Grid details (city, neighborhoods served & meeting points) */}
                  <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-950/40 p-3.5 rounded-xl border border-slate-900/60">
                    <div className="flex flex-col gap-1 border-r border-slate-900 pr-2">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Atende em ({inst.city})</span>
                      <p className="text-slate-300 font-semibold truncate" title={inst.neighborhoods.join(", ")}>
                        {inst.neighborhoods.join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 pl-2">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Encontros Padrão</span>
                      <p className="text-slate-300 font-semibold truncate" title={inst.meetingPoints.join(", ")}>
                        {inst.meetingPoints.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Footer Card actions */}
                  <div className="flex justify-between items-center border-t border-slate-800/60 pt-4 mt-1">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Valor da Aula</span>
                      <span className="text-lg font-black text-white">R$ {inst.hourlyRate} <span className="text-xs font-normal text-slate-400">/ 50min</span></span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(inst)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                      </svg>
                      Contatar Instrutor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Booking Form Dialog Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded-full cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl font-bold animate-bounce">
                  ✓
                </div>
                <h4 className="font-extrabold text-white text-base">Solicitação de Aula Enviada!</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  O instrutor <strong className="text-slate-200">{selectedInstructor.name}</strong> recebeu seus dados e entrará em contato em breve via WhatsApp para agendar sua aula prática.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="flex flex-col gap-4">
                <div>
                  <h4 className="font-extrabold text-white text-lg">Solicitar Aula</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Com o instrutor {selectedInstructor.name}</p>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Ex: Pedro Silva"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Select Category */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Categoria Pretendida</label>
                  <select
                    value={bookingCategory}
                    onChange={(e) => setBookingCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    {selectedInstructor.categories.map((c) => (
                      <option key={c} value={c}>
                        Categoria {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Meeting Point */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Ponto de Encontro Preferencial</label>
                  <select
                    value={bookingMeetingPoint}
                    onChange={(e) => setBookingMeetingPoint(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    {selectedInstructor.meetingPoints.map((mp) => (
                      <option key={mp} value={mp}>
                        {mp}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl shadow-lg mt-2 text-xs transition-transform active:scale-98 cursor-pointer"
                >
                  Enviar Solicitação
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-6 text-slate-600 text-[10px] z-10 border-t border-slate-900 bg-slate-950">
        &copy; {new Date().getFullYear()} Volante Certo S.A. Todos os direitos reservados.
      </footer>
    </div>
  );
}
