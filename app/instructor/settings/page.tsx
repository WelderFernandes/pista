"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { centsToBRL, brlToCents } from "@/lib/utils";

const WEEKDAYS = [
  { value: 0, label: "Dom", fullName: "Domingo" },
  { value: 1, label: "Seg", fullName: "Segunda-feira" },
  { value: 2, label: "Ter", fullName: "Terça-feira" },
  { value: 3, label: "Qua", fullName: "Quarta-feira" },
  { value: 4, label: "Qui", fullName: "Quinta-feira" },
  { value: 5, label: "Sex", fullName: "Sexta-feira" },
  { value: 6, label: "Sáb", fullName: "Sábado" },
];

const AVAILABLE_CATEGORIES = [
  { value: "A", label: "A (Moto)" },
  { value: "B", label: "B (Carro)" },
  { value: "C", label: "C (Caminhão)" },
  { value: "D", label: "D (Ônibus)" },
];

export default function InstructorSettingsPage() {
  const { settings, updateSettings } = useApp();

  // Local Form states initialized from Context Settings
  const [workDays, setWorkDays] = useState<number[]>(settings?.workDays || [1, 2, 3, 4, 5, 6]);
  const [workStart, setWorkStart] = useState<string>(settings?.workStart || "08:00");
  const [workEnd, setWorkEnd] = useState<string>(settings?.workEnd || "18:00");
  const [lunchStart, setLunchStart] = useState<string>(settings?.lunchStart || "12:00");
  const [lunchEnd, setLunchEnd] = useState<string>(settings?.lunchEnd || "13:30");
  const [extraDays, setExtraDays] = useState<{ date: string; start: string; end: string }[]>(
    settings?.extraDays || []
  );

  // New discovery & search fields
  const [city, setCity] = useState<string>(settings?.city || "São Paulo");
  const [neighborhoodsInput, setNeighborhoodsInput] = useState<string>(
    settings?.neighborhoods?.join(", ") || "Centro, Pinheiros, Vila Madalena, Jardins"
  );
  const [meetingPointsInput, setMeetingPointsInput] = useState<string>(
    settings?.meetingPoints?.join(", ") || "Centro Comercial, Estação de Metrô Pinheiros, Shopping Boulevard"
  );
  const [hourlyRate, setHourlyRate] = useState<number>(centsToBRL(settings?.hourlyRate ?? 12000));
  const [categories, setCategories] = useState<string[]>(settings?.categories || ["B"]);
  const [bio, setBio] = useState<string>(
    settings?.bio || "Instrutor credenciado com mais de 10 anos de experiência, especializado em direção defensiva e preparação para exames práticos."
  );

  // Local state for the "Add Extra Day" form
  const [newExtraDate, setNewExtraDate] = useState<string>("");
  const [newExtraStart, setNewExtraStart] = useState<string>("08:00");
  const [newExtraEnd, setNewExtraEnd] = useState<string>("14:00");

  // Notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleDayToggle = (dayValue: number) => {
    if (workDays.includes(dayValue)) {
      setWorkDays(workDays.filter((d) => d !== dayValue));
    } else {
      setWorkDays([...workDays, dayValue].sort());
    }
  };

  const handleCategoryToggle = (catValue: string) => {
    if (categories.includes(catValue)) {
      setCategories(categories.filter((c) => c !== catValue));
    } else {
      setCategories([...categories, catValue]);
    }
  };

  const handleAddExtraDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraDate) {
      alert("Por favor, selecione uma data válida para a agenda extra.");
      return;
    }

    // Check if date already exists
    if (extraDays.some((ed) => ed.date === newExtraDate)) {
      alert("Já existe uma agenda extra configurada para esta data.");
      return;
    }

    const updated = [
      ...extraDays,
      { date: newExtraDate, start: newExtraStart, end: newExtraEnd },
    ].sort((a, b) => a.date.localeCompare(b.date));

    setExtraDays(updated);
    setNewExtraDate("");
    triggerToast("Dia extra adicionado com sucesso!");
  };

  const handleRemoveExtraDay = (dateToRemove: string) => {
    setExtraDays(extraDays.filter((ed) => ed.date !== dateToRemove));
    triggerToast("Dia extra removido.");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSaveAll = () => {
    // Basic validation
    if (workStart >= workEnd) {
      alert("O horário de início do trabalho deve ser anterior ao horário de término.");
      return;
    }
    if (lunchStart >= lunchEnd) {
      alert("O horário de início do almoço deve ser anterior ao término.");
      return;
    }
    if (lunchStart < workStart || lunchEnd > workEnd) {
      alert("O horário de almoço deve estar contido dentro do período de trabalho.");
      return;
    }
    if (!city.trim()) {
      alert("Por favor, informe a cidade de atuação.");
      return;
    }
    if (categories.length === 0) {
      alert("Selecione ao menos uma categoria habilitada.");
      return;
    }

    // Parse comma-separated inputs to clean arrays
    const parsedNeighborhoods = neighborhoodsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const parsedMeetingPoints = meetingPointsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateSettings({
      workDays,
      workStart,
      workEnd,
      lunchStart,
      lunchEnd,
      extraDays,
      city: city.trim(),
      neighborhoods: parsedNeighborhoods,
      meetingPoints: parsedMeetingPoints,
      hourlyRate: brlToCents(Number(hourlyRate)),
      categories,
      bio: bio.trim(),
    });

    triggerToast("Configurações salvas com sucesso!");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Configurações do Instrutor</h2>
          <p className="text-slate-500 text-sm">Defina seus horários de expediente, área de atuação e biografia profissional.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-orange-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Salvar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Work time & Location settings) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Public Profile Search Settings Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Área de Atuação & Perfil Público
            </h3>
            <p className="text-xs text-slate-400 mb-5">Configure as informações que os alunos usarão para filtrar e encontrar você na busca.</p>

            <div className="flex flex-col gap-4">
              {/* City and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Valor da Hora/Aula (R$)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                    placeholder="Ex: 120"
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Served Neighborhoods */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Bairros de Atuação (separados por vírgula)</label>
                <input
                  type="text"
                  value={neighborhoodsInput}
                  onChange={(e) => setNeighborhoodsInput(e.target.value)}
                  placeholder="Ex: Centro, Pinheiros, Vila Madalena"
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Default Meeting Points */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Pontos de Encontro Padrão (separados por vírgula)</label>
                <input
                  type="text"
                  value={meetingPointsInput}
                  onChange={(e) => setMeetingPointsInput(e.target.value)}
                  placeholder="Ex: Autoescola Centro, Metrô Pinheiros"
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Categories pills selection */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-2 font-semibold uppercase tracking-wider">Categorias de Ensino Habilitadas</label>
                <div className="flex gap-2">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = categories.includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.value)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-orange-600 border-orange-600 text-white shadow-sm"
                            : "bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Professional Description */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Apresentação / Minibiografia</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Fale brevemente sobre sua experiência e metodologia de ensino..."
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Days of Work Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
              </svg>
              Dias de Trabalho Semanais
            </h3>
            <p className="text-xs text-slate-400 mb-5">Marque os dias que você normalmente atende na autoescola.</p>

            <div className="flex flex-wrap gap-2 justify-between">
              {WEEKDAYS.map((day) => {
                const isSelected = workDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`flex-1 min-w-[50px] py-3.5 rounded-xl border text-sm font-bold transition-all text-center ${
                      isSelected
                        ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/10"
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work Hours & Lunch Breaks Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Horário de Expediente & Intervalos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Working Hours */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Jornada de Trabalho</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Entrada</label>
                    <input
                      type="time"
                      value={workStart}
                      onChange={(e) => setWorkStart(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Saída</label>
                    <input
                      type="time"
                      value={workEnd}
                      onChange={(e) => setWorkEnd(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Lunch Break */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Intervalo de Almoço</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Início</label>
                    <input
                      type="time"
                      value={lunchStart}
                      onChange={(e) => setLunchStart(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Término</label>
                    <input
                      type="time"
                      value={lunchEnd}
                      onChange={(e) => setLunchEnd(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Shift Info Panel */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-500">Resumo da Jornada Diária</span>
              <div className="flex justify-between text-xs text-slate-600 bg-orange-50/50 p-3 rounded-lg border border-orange-100/30">
                <span>Horas de Atendimento: <strong className="text-slate-800">{workStart} às {workEnd}</strong></span>
                <span>Pausa para Almoço: <strong className="text-slate-800">{lunchStart} às {lunchEnd}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Slots Settings Column (right) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Abrir Agenda Extra
              </h3>
              <p className="text-xs text-slate-400">Abra exceções para trabalhar em dias que você normalmente estaria de folga (ex: feriados ou domingos).</p>
            </div>

            <form onSubmit={handleAddExtraDay} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Data do Dia Extra</label>
                <input
                  type="date"
                  required
                  value={newExtraDate}
                  onChange={(e) => setNewExtraDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Hora Início</label>
                  <input
                    type="time"
                    required
                    value={newExtraStart}
                    onChange={(e) => setNewExtraStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Hora Fim</label>
                  <input
                    type="time"
                    required
                    value={newExtraEnd}
                    onChange={(e) => setNewExtraEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all active:scale-95 cursor-pointer mt-1"
              >
                + Adicionar Exceção
              </button>
            </form>

            {/* List of active Extra Days exceptions */}
            <div className="border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-500 block mb-3">Exceções Ativas ({extraDays.length})</span>
              
              {extraDays.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-medium">Nenhum dia extra cadastrado</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {extraDays.map((ed) => {
                    // format date for PT-BR
                    const [year, month, day] = ed.date.split("-");
                    const dateFormatted = `${day}/${month}/${year}`;

                    return (
                      <div
                        key={ed.date}
                        className="flex items-center justify-between bg-orange-50/40 p-2.5 rounded-xl border border-orange-100/50"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{dateFormatted}</span>
                          <span className="text-[10px] text-orange-600 font-medium">
                            {ed.start} - {ed.end}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraDay(ed.date)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-all cursor-pointer"
                          title="Remover Exceção"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Save Button Area (fixed-like button spacer) */}
      <div className="flex justify-center mt-4 md:hidden">
        <button
          onClick={handleSaveAll}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
