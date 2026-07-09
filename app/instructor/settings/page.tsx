"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { centsToBRL, brlToCents } from "@/lib/utils";
import { getVehicleBrandsAction, getVehicleModelsAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  MapPin,
  Buildings,
  MapTrifold,
  Clock,
  CalendarBlank,
  Info,
} from "@phosphor-icons/react";
import { useCep } from "@/lib/hooks/useCep";
import { popularBrands, popularModelsByBrand } from "@/lib/autocomplete-data";

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
  const { settings, updateSettings, vehicles, addVehicle, deleteVehicle } = useApp();

  // Fleet management states
  const [newVehName, setNewVehName] = useState("");
  const [newVehPlate, setNewVehPlate] = useState("");
  const [newVehCategory, setNewVehCategory] = useState("B");
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehColor, setNewVehColor] = useState("");
  const [newVehAutomatic, setNewVehAutomatic] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [isAddingVeh, setIsAddingVeh] = useState(false);

  // DB-driven autocomplete states
  const [dbBrands, setDbBrands] = useState<{ id: string; name: string; type: string }[]>([]);
  const [dbModels, setDbModels] = useState<{ id: string; name: string; type: string }[]>([]);

  // Load brands on mount
  useEffect(() => {
    getVehicleBrandsAction()
      .then((brands) => setDbBrands(brands))
      .catch((err) => console.error("Erro ao buscar marcas do banco:", err));
  }, []);

  // Load models on brand input change
  useEffect(() => {
    const brandTrimmed = newVehBrand.trim();
    if (brandTrimmed) {
      getVehicleModelsAction(brandTrimmed)
        .then((models) => setDbModels(models))
        .catch((err) => console.error("Erro ao buscar modelos do banco:", err));
    } else {
      setDbModels([]);
    }
  }, [newVehBrand]);

  const handleAddInstructorVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehName.trim()) return;
    setIsAddingVeh(true);
    try {
      await addVehicle({
        name: newVehName,
        plate: newVehPlate || undefined,
        category: newVehCategory,
        brand: newVehBrand || undefined,
        color: newVehColor || undefined,
        automatic: newVehAutomatic,
      });
      setNewVehName("");
      setNewVehPlate("");
      setNewVehBrand("");
      setNewVehColor("");
      setNewVehCategory("B");
      setNewVehAutomatic(false);
    } catch (err) {
      console.error("Erro ao adicionar veículo de instrução:", err);
    } finally {
      setIsAddingVeh(false);
    }
  };

  // Local Form states initialized from Context Settings
  const [workDays, setWorkDays] = useState<number[]>(
    settings?.workDays || [1, 2, 3, 4, 5, 6],
  );
  const [workStart, setWorkStart] = useState<string>(
    settings?.workStart || "08:00",
  );
  const [workEnd, setWorkEnd] = useState<string>(settings?.workEnd || "18:00");
  const [lunchStart, setLunchStart] = useState<string>(
    settings?.lunchStart || "12:00",
  );
  const [lunchEnd, setLunchEnd] = useState<string>(
    settings?.lunchEnd || "13:30",
  );
  const [extraDays, setExtraDays] = useState<
    { date: string; start: string; end: string }[]
  >(settings?.extraDays || []);

  // Address states
  const [cep, setCep] = useState<string>(settings?.address?.cep || "");
  const [street, setStreet] = useState<string>(settings?.address?.street || "");
  const [number, setNumber] = useState<string>(settings?.address?.number || "");
  const [complement, setComplement] = useState<string>(settings?.address?.complement || "");
  const [neighborhood, setNeighborhood] = useState<string>(settings?.address?.neighborhood || "");
  const [state, setState] = useState<string>(settings?.address?.state || "");
  const [city, setCity] = useState<string>(settings?.address?.city || settings?.city || "São Paulo");

  const { lookupCep, loading: loadingCep, error: errorCep } = useCep();

  const handleCepSearch = async (cepValue: string) => {
    const data = await lookupCep(cepValue);
    if (data) {
      setStreet(data.street || "");
      setNeighborhood(data.neighborhood || "");
      setCity(data.city || "");
      setState(data.state || "");
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setCep(val);
    if (val.length === 8) {
      handleCepSearch(val);
    }
  };

  // New discovery & search fields
  const [neighborhoodsInput, setNeighborhoodsInput] = useState<string>(
    settings?.neighborhoods?.join(", ") ||
      "Centro, Pinheiros, Vila Madalena, Jardins",
  );
  const [meetingPointsInput, setMeetingPointsInput] = useState<string>(
    settings?.meetingPoints?.join(", ") ||
      "Centro Comercial, Estação de Metrô Pinheiros, Shopping Boulevard",
  );
  const [hourlyRate, setHourlyRate] = useState<number>(
    centsToBRL(settings?.hourlyRate ?? 12000),
  );
  const [categories, setCategories] = useState<string[]>(
    settings?.categories || ["B"],
  );
  const [bio, setBio] = useState<string>(
    settings?.bio ||
      "Instrutor credenciado com mais de 10 anos de experiência, especializado em direção defensiva e preparação para exames práticos.",
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
      alert(
        "O horário de início do trabalho deve ser anterior ao horário de término.",
      );
      return;
    }
    if (lunchStart >= lunchEnd) {
      alert("O horário de início do almoço deve ser anterior ao término.");
      return;
    }
    if (lunchStart < workStart || lunchEnd > workEnd) {
      alert(
        "O horário de almoço deve estar contido dentro do período de trabalho.",
      );
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
    if (!cep.trim() || cep.replace(/\D/g, "").length !== 8) {
      alert("Por favor, informe um CEP válido.");
      return;
    }
    if (!street.trim()) {
      alert("Por favor, informe a rua/logradouro.");
      return;
    }
    if (!neighborhood.trim()) {
      alert("Por favor, informe o bairro.");
      return;
    }
    if (!number.trim()) {
      alert("Por favor, informe o número do endereço.");
      return;
    }
    if (!city.trim()) {
      alert("Por favor, informe a cidade.");
      return;
    }
    if (!state.trim() || state.trim().length !== 2) {
      alert("Por favor, informe a UF/estado.");
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
      address: {
        cep,
        state,
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim() || undefined,
      },
    });

    triggerToast("Configurações salvas com sucesso!");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up relative pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-905/90 dark:bg-slate-950/90 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-4 py-3 rounded-xl shadow-xl border border-slate-800/80 flex items-center gap-2 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-200/30 dark:border-slate-850 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Configurações do Instrutor
          </h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
            Defina seus horários de expediente, área de atuação e biografia
            profissional.
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5 h-10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Salvar Tudo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Work time & Location settings) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Public Profile Search Settings Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-black text-slate-855 dark:text-white uppercase tracking-wider text-[9px] mb-2 flex items-center gap-1.5">
              <svg
                className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              Área de Atuação & Perfil Público
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-5">
              Configure as informações que os alunos usarão para filtrar e
              encontrar você na busca.
            </p>

            <div className="flex flex-col gap-4">
              {/* CEP and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">CEP de Atuação</Label>
                  <div className="mt-1 flex gap-2">
                    <InputGroup className="flex-1 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <MapPin className="w-4 h-4 text-slate-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="cep"
                        maxLength={9}
                        value={cep}
                        onChange={handleCepChange}
                        placeholder="Ex: 01310-100"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                    <button
                      type="button"
                      disabled={loadingCep || cep.replace(/\D/g, "").length !== 8}
                      onClick={() => handleCepSearch(cep)}
                      className="bg-blue-650 hover:bg-blue-700 disabled:opacity-50 text-white px-4 rounded-xl text-xs font-bold transition-all h-10 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                    >
                      {loadingCep ? "..." : "Buscar"}
                    </button>
                  </div>
                  {errorCep && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                      ⚠️ {errorCep}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hourlyRate" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Valor da Hora/Aula (R$)</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <InputGroupText className="font-bold text-slate-400 text-xs">
                          R$
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        id="hourlyRate"
                        value={hourlyRate}
                        onChange={(e) =>
                          setHourlyRate(Math.max(0, Number(e.target.value)))
                        }
                        placeholder="Ex: 120"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText className="font-bold text-slate-400 text-xs">
                          /h
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              </div>

              {/* Address details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Rua / Logradouro</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Av. Paulista"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="number" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Número</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="1000"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="neighborhood" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Bairro</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="neighborhood"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Bela Vista"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="complement" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Complemento</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="complement"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Apto 42"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Cidade</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="São Paulo"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="state" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Estado (UF)</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="state"
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        placeholder="SP"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              {/* Served Neighborhoods */}
              <div>
                <Label htmlFor="neighborhoods" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                  Bairros de Atuação (separados por vírgula)
                </Label>
                <div className="mt-1">
                  <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                    <InputGroupAddon align="inline-start">
                      <Buildings className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="neighborhoods"
                      value={neighborhoodsInput}
                      onChange={(e) => setNeighborhoodsInput(e.target.value)}
                      placeholder="Ex: Centro, Pinheiros, Vila Madalena"
                      className="h-full px-3 text-xs text-slate-800 dark:text-white"
                    />
                  </InputGroup>
                </div>
              </div>

              {/* Default Meeting Points */}
              <div>
                <Label htmlFor="meetingPoints" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                  Pontos de Encontro Padrão (separados por vírgula)
                </Label>
                <div className="mt-1">
                  <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                    <InputGroupAddon align="inline-start">
                      <MapTrifold className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="meetingPoints"
                      value={meetingPointsInput}
                      onChange={(e) => setMeetingPointsInput(e.target.value)}
                      placeholder="Ex: Autoescola Centro, Metrô Pinheiros"
                      className="h-full px-3 text-xs text-slate-800 dark:text-white"
                    />
                  </InputGroup>
                </div>
              </div>

              {/* Categories pills selection */}
              <div>
                <Label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Categorias de Ensino Habilitadas</Label>
                <div className="flex gap-2 mt-1.5">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = categories.includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.value)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
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
                <Label htmlFor="bio" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Apresentação / Minibiografia</Label>
                <div className="mt-1">
                  <InputGroup className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600 items-start">
                    <InputGroupAddon align="inline-start" className="pt-3">
                      <Info className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Fale brevemente sobre sua experiência e metodologia de ensino..."
                      className="px-3 text-xs text-slate-800 dark:text-white min-h-[80px]"
                    />
                  </InputGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Days of Work Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-black text-slate-855 dark:text-white uppercase tracking-wider text-[9px] mb-2 flex items-center gap-1.5">
              <svg
                className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z"
                />
              </svg>
              Dias de Trabalho Semanais
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-5">
              Marque os dias que você normalmente atende na autoescola.
            </p>

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
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
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
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-black text-slate-855 dark:text-white uppercase tracking-wider text-[9px] mb-4 flex items-center gap-1.5">
              <svg
                className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Horário de Expediente & Intervalos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Working Hours */}
              <div className="bg-slate-50/50 dark:bg-slate-955/40 p-4 rounded-xl border border-slate-200/30 dark:border-slate-900 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                  Jornada de Trabalho
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase tracking-wider">
                      Entrada
                    </label>
                    <InputGroup className="h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="time"
                        value={workStart}
                        onChange={(e) => setWorkStart(e.target.value)}
                        className="h-full px-2 text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase tracking-wider">
                      Saída
                    </label>
                    <InputGroup className="h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="time"
                        value={workEnd}
                        onChange={(e) => setWorkEnd(e.target.value)}
                        className="h-full px-2 text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              {/* Lunch Break */}
              <div className="bg-slate-50/50 dark:bg-slate-955/40 p-4 rounded-xl border border-slate-200/30 dark:border-slate-900 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                  Intervalo de Almoço
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase tracking-wider">
                      Início
                    </label>
                    <InputGroup className="h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="time"
                        value={lunchStart}
                        onChange={(e) => setLunchStart(e.target.value)}
                        className="h-full px-2 text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase tracking-wider">
                      Término
                    </label>
                    <InputGroup className="h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="time"
                        value={lunchEnd}
                        onChange={(e) => setLunchEnd(e.target.value)}
                        className="h-full px-2 text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Shift Info Panel */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-500">
                Resumo da Jornada Diária
              </span>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 rounded-xl border border-blue-150/40 dark:border-blue-900/40 font-semibold">
                <span>
                  Horas de Atendimento:{" "}
                  <strong className="text-slate-800">
                    {workStart} às {workEnd}
                  </strong>
                </span>
                <span>
                  Pausa para Almoço:{" "}
                  <strong className="text-slate-800">
                    {lunchStart} às {lunchEnd}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Slots Settings Column (right) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col gap-5">
            <div>
              <h3 className="text-xs font-black text-slate-855 dark:text-white uppercase tracking-wider text-[9px] mb-1 flex items-center gap-1.5">
                <svg
                  className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Abrir Agenda Extra
              </h3>
              <p className="text-xs text-slate-400">
                Abra exceções para trabalhar em dias que você normalmente
                estaria de folga (ex: feriados ou domingos).
              </p>
            </div>

            <form onSubmit={handleAddExtraDay} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="newExtraDate" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Data do Dia Extra</Label>
                <div className="mt-1">
                  <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                    <InputGroupInput
                      type="date"
                      id="newExtraDate"
                      required
                      value={newExtraDate}
                      onChange={(e) => setNewExtraDate(e.target.value)}
                      className="h-full px-3 text-xs text-slate-800 dark:text-white"
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="newExtraStart" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Hora Início</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="time"
                        id="newExtraStart"
                        required
                        value={newExtraStart}
                        onChange={(e) => setNewExtraStart(e.target.value)}
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newExtraEnd" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Hora Fim</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="time"
                        id="newExtraEnd"
                        required
                        value={newExtraEnd}
                        onChange={(e) => setNewExtraEnd(e.target.value)}
                        className="h-full px-3 text-xs text-slate-800 dark:text-white"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-915 text-white border border-slate-800/80 dark:border-slate-800 font-bold text-xs h-10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-1 rounded-xl uppercase tracking-wider text-[9px]"
              >
                + Adicionar Exceção
              </Button>
            </form>

            {/* List of active Extra Days exceptions */}
            <div className="border-t border-slate-100 pt-4">
              <span className="text-[9px] font-black text-slate-855 dark:text-white uppercase tracking-wider block mb-3">
                Exceções Ativas ({extraDays.length})
              </span>

              {extraDays.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200/40 dark:border-slate-800/80 rounded-xl bg-slate-50/20 dark:bg-slate-955/10">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Nenhum dia extra cadastrado
                  </span>
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
                        className="flex items-center justify-between bg-white dark:bg-slate-955 p-3 rounded-xl border border-slate-200/40 dark:border-slate-900"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">
                            {dateFormatted}
                          </span>
                          <span className="text-[10px] text-blue-600 font-medium">
                            {ed.start} - {ed.end}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraDay(ed.date)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                          title="Remover Exceção"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Frota de Veículos Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col gap-5">
            <div>
              <h3 className="text-xs font-black text-slate-855 dark:text-white uppercase tracking-wider text-[9px] mb-1 flex items-center gap-1.5">
                <svg className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 16h6a1 1 0 001-1v-4a1 1 0 00-1-1h-6m0 6v-4" />
                </svg>
                Frota de Veículos
              </h3>
              <p className="text-xs text-slate-400">
                Gerencie os carros e motos utilizados nas aulas práticas da autoescola.
              </p>
            </div>

            <form onSubmit={handleAddInstructorVehicle} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {/* Brand Input (Marca) - First Input */}
                <div className="relative">
                  <Label htmlFor="vehBrand" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Marca</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="vehBrand"
                        value={newVehBrand}
                        onFocus={() => {
                          setShowBrandSuggestions(true);
                          setShowNameSuggestions(false);
                        }}
                        onChange={(e) => {
                          setNewVehBrand(e.target.value);
                          setShowBrandSuggestions(true);
                        }}
                        placeholder="Ex: Chevrolet"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                      />
                    </InputGroup>
                    {showBrandSuggestions && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowBrandSuggestions(false)} 
                        />
                        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                          {dbBrands
                            .filter((b) => {
                              const matchesType =
                                newVehCategory === "A"
                                  ? b.type === "motorcycle" || b.type === "both"
                                  : b.type === "car" || b.type === "both";
                              const matchesSearch = b.name.toLowerCase().includes(newVehBrand.toLowerCase());
                              return matchesType && matchesSearch;
                            })
                            .map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                  setNewVehBrand(b.name);
                                  setShowBrandSuggestions(false);
                                  if (b.type === "motorcycle") {
                                    setNewVehCategory("A");
                                  } else if (b.type === "car") {
                                    setNewVehCategory("B");
                                  }
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 transition-colors cursor-pointer"
                              >
                                {b.name}
                              </button>
                            ))}
                          {dbBrands.filter((b) => {
                            const matchesType =
                              newVehCategory === "A"
                                ? b.type === "motorcycle" || b.type === "both"
                                : b.type === "car" || b.type === "both";
                            const matchesSearch = b.name.toLowerCase().includes(newVehBrand.toLowerCase());
                            return matchesType && matchesSearch;
                          }).length === 0 && (
                            <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-550">
                              Nenhuma marca sugerida
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Vehicle name / Model Input */}
                <div className="relative">
                  <Label htmlFor="vehName" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Nome do Veículo / Modelo</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="vehName"
                        required
                        value={newVehName}
                        onFocus={() => {
                          setShowNameSuggestions(true);
                          setShowBrandSuggestions(false);
                        }}
                        onChange={(e) => {
                          setNewVehName(e.target.value);
                          setShowNameSuggestions(true);
                        }}
                        placeholder="Ex: Onix 1.0"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                      />
                    </InputGroup>
                    {showNameSuggestions && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowNameSuggestions(false)} 
                        />
                        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                          {(() => {
                            const filteredModels = dbModels.filter(m => {
                              const matchesType =
                                newVehCategory === "A"
                                  ? m.type === "motorcycle"
                                  : m.type === "car";
                              const matchesSearch = m.name.toLowerCase().includes(newVehName.toLowerCase());
                              return matchesType && matchesSearch;
                            });

                            if (filteredModels.length === 0) {
                              return (
                                <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-550">
                                  Nenhuma sugestão encontrada
                                </div>
                              );
                            }

                            return filteredModels.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setNewVehName(m.name);
                                  setShowNameSuggestions(false);
                                  if (m.type === "motorcycle") {
                                    setNewVehCategory("A");
                                  } else {
                                    setNewVehCategory("B");
                                  }
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 transition-colors cursor-pointer"
                              >
                                {m.name}
                              </button>
                            ));
                          })()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <Label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Categoria CNH</Label>
                  <div className="mt-1 relative">
                    <button
                      type="button"
                      onClick={() => setShowCatDropdown(!showCatDropdown)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-905 text-xs focus:outline-none focus:border-blue-600 text-slate-850 dark:text-white flex items-center justify-between cursor-pointer text-left font-medium"
                    >
                      <span>
                        {newVehCategory === "B" && "Cat. B (Carro)"}
                        {newVehCategory === "A" && "Cat. A (Moto)"}
                        {newVehCategory === "C" && "Cat. C (Caminhão)"}
                        {newVehCategory === "D" && "Cat. D (Ônibus)"}
                      </span>
                      <span className="text-slate-400 text-[9px]">▼</span>
                    </button>
                    {showCatDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCatDropdown(false)} />
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                          {[
                            { value: "B", label: "Cat. B (Carro)" },
                            { value: "A", label: "Cat. A (Moto)" },
                            { value: "C", label: "Cat. C (Caminhão)" },
                            { value: "D", label: "Cat. D (Ônibus)" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setNewVehCategory(opt.value);
                                setShowCatDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 transition-colors flex items-center justify-between cursor-pointer ${
                                newVehCategory === opt.value ? "bg-slate-50 dark:bg-slate-850 font-bold" : ""
                              }`}
                            >
                              <span>{opt.label}</span>
                              {newVehCategory === opt.value && <span className="text-blue-600">✓</span>}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="vehPlate" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Placa</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="vehPlate"
                        value={newVehPlate}
                        onChange={(e) => setNewVehPlate(e.target.value)}
                        placeholder="ABC1D23"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                      />
                    </InputGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="vehColor" className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Cor (opcional)</Label>
                  <div className="mt-1">
                    <InputGroup className="h-10 rounded-xl bg-white dark:bg-slate-955 border border-slate-200/40 dark:border-slate-850 focus-within:border-blue-600">
                      <InputGroupInput
                        type="text"
                        id="vehColor"
                        value={newVehColor}
                        onChange={(e) => setNewVehColor(e.target.value)}
                        placeholder="Prata"
                        className="h-full px-3 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              {/* Transmission Toggle Field */}
              <div>
                <Label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Câmbio / Transmissão</Label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewVehAutomatic(false)}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      !newVehAutomatic
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewVehAutomatic(true)}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      newVehAutomatic
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    Automático
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAddingVeh}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-915 text-white border border-slate-800/80 dark:border-slate-800 font-bold text-xs h-10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-1.5 rounded-xl uppercase tracking-wider text-[9px]"
              >
                {isAddingVeh ? "Adicionando..." : "+ Cadastrar Veículo"}
              </Button>
            </form>

            <div className="border-t border-slate-200/30 dark:border-slate-850 pt-4">
              <span className="text-[9px] font-black text-slate-850 dark:text-white uppercase tracking-wider block mb-3">
                Frota Registrada ({vehicles.filter(v => !v.studentId).length})
              </span>

              {vehicles.filter(v => !v.studentId).length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200/40 dark:border-slate-800/80 rounded-xl bg-slate-50/20 dark:bg-slate-955/10">
                  <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium">
                    Nenhum veículo na frota
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {vehicles.filter(v => !v.studentId).map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between bg-white dark:bg-slate-955 p-3 rounded-xl border border-slate-200/40 dark:border-slate-900"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                          {v.name}
                        </span>
                        <span className="text-[9px] text-blue-650 dark:text-blue-400 font-bold uppercase tracking-wider mt-0.5">
                          Cat. {v.category} • Placa: {v.plate || "N/D"} • Câmbio: {v.automatic ? "Automático" : "Manual"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteVehicle(v.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                        title="Remover Veículo"
                      >
                        <svg
                          className="w-4.5 h-4.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Save Button Area (fixed-like button spacer) */}
      <div className="flex justify-center mt-4 md:hidden">
        <Button
          onClick={handleSaveAll}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
