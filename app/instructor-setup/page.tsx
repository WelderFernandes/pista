"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { brlToCents } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Buildings,
  Car,
  Notebook,
  Plus,
  Trash
} from "@phosphor-icons/react";
import { updateSettingsAction, addVehicleAction } from "@/app/actions";

export default function InstructorSetupPage() {
  const { settings } = useApp();

  const [signupStep, setSignupStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states initialized with generic defaults, falling back to db defaults if loaded
  const [city, setCity] = useState(settings?.city || "São Paulo");
  const [neighborhoodsInput, setNeighborhoodsInput] = useState(
    settings?.neighborhoods?.join(", ") || "Centro, Pinheiros, Jardins"
  );
  const [meetingPointsInput, setMeetingPointsInput] = useState(
    settings?.meetingPoints?.join(", ") || "Metrô Consolação, Shopping Cidade São Paulo"
  );
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(
    settings?.categories || ["B"]
  );
  const [hourlyRateInput, setHourlyRateInput] = useState(
    settings?.hourlyRate ? (settings.hourlyRate / 100).toString() : "120"
  );
  const [bio, setBio] = useState(
    settings?.bio || "Instrutor credenciado com ampla experiência no ensino de novos motoristas com paciência e didática."
  );

  // Dynamic Vehicle onboarding states
  const [vehiclesToCreate, setVehiclesToCreate] = useState<{
    name: string;
    plate: string;
    category: string;
    brand: string;
    color: string;
  }[]>([]);

  const [newVehName, setNewVehName] = useState("");
  const [newVehPlate, setNewVehPlate] = useState("");
  const [newVehCategory, setNewVehCategory] = useState("B");
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehColor, setNewVehColor] = useState("");

  const handleAddVehicle = () => {
    if (!newVehName.trim()) return;
    setVehiclesToCreate([
      ...vehiclesToCreate,
      {
        name: newVehName,
        plate: newVehPlate,
        category: newVehCategory,
        brand: newVehBrand,
        color: newVehColor
      }
    ]);
    setNewVehName("");
    setNewVehPlate("");
    setNewVehBrand("");
    setNewVehColor("");
  };

  const handleRemoveVehicle = (index: number) => {
    setVehiclesToCreate(vehiclesToCreate.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (category: string) => {
    setCategoriesSelected(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleNextStep = () => {
    if (signupStep === 1 && city.trim().length > 0 && neighborhoodsInput.trim().length > 0) {
      setSignupStep(2);
    } else if (signupStep === 2 && categoriesSelected.length > 0 && Number(hourlyRateInput) > 0) {
      setSignupStep(3);
    } else if (signupStep === 3) {
      setSignupStep(4);
    }
  };

  const handlePrevStep = () => {
    if (signupStep > 1) {
      setSignupStep(signupStep - 1);
    }
  };

  const handleFinishSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean neighborhoods and meeting points
      const neighborhoods = neighborhoodsInput
        .split(",")
        .map(n => n.trim())
        .filter(n => n.length > 0);
      
      const meetingPoints = meetingPointsInput
        .split(",")
        .map(m => m.trim())
        .filter(m => m.length > 0);

      // Save vehicles sequentially
      for (const v of vehiclesToCreate) {
        await addVehicleAction({
          name: v.name,
          plate: v.plate,
          category: v.category,
          brand: v.brand,
          color: v.color
        });
      }

      // Save using Server Action
      await updateSettingsAction({
        id: settings?.id || "",
        organizationId: settings?.organizationId || "",
        city,
        neighborhoods,
        meetingPoints,
        hourlyRate: brlToCents(Number(hourlyRateInput)),
        categories: categoriesSelected,
        bio,
        workDays: settings?.workDays || [1, 2, 3, 4, 5, 6],
        workStart: settings?.workStart || "08:00",
        workEnd: settings?.workEnd || "18:00",
        lunchStart: settings?.lunchStart || "12:00",
        lunchEnd: settings?.lunchEnd || "13:30",
      } as any);

      // Force a full reload to /instructor to ensure all context data is fully re-fetched
      window.location.href = "/instructor";
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-rose-500 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 text-white">
            P
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter text-slate-900 dark:text-white">
            Pista
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 transition-colors duration-300 backdrop-blur-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              Complete seu Perfil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Parabéns pela conta! Agora vamos configurar o seu ambiente de aulas práticas.
            </p>
          </div>

          {/* Onboarding step indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
              <span className="text-blue-600 dark:text-blue-400">Passo {signupStep} de 4</span>
              <span className="text-slate-700 dark:text-slate-300">
                {signupStep === 1 
                  ? "Área de Atuação" 
                  : signupStep === 2 
                  ? "Ensino & Preço" 
                  : signupStep === 3
                  ? "Seus Veículos"
                  : "Sua Apresentação"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 1 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 2 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 3 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 4 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
            </div>
            
            <div className="flex justify-between items-center mt-4 px-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-xl border transition-all duration-300 ${signupStep === 1 ? "border-blue-600 bg-blue-600/10 text-blue-600" : signupStep > 1 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                <Buildings className="w-4 h-4" />
              </div>
              <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 mx-1" />
              <div className={`flex items-center justify-center w-7 h-7 rounded-xl border transition-all duration-300 ${signupStep === 2 ? "border-blue-600 bg-blue-600/10 text-blue-600" : signupStep > 2 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                <Car className="w-4 h-4" />
              </div>
              <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 mx-1" />
              <div className={`flex items-center justify-center w-7 h-7 rounded-xl border transition-all duration-300 ${signupStep === 3 ? "border-blue-600 bg-blue-600/10 text-blue-600" : signupStep > 3 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                <Car className="w-4 h-4" />
              </div>
              <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 mx-1" />
              <div className={`flex items-center justify-center w-7 h-7 rounded-xl border transition-all duration-300 ${signupStep === 4 ? "border-blue-600 bg-blue-600/10 text-blue-600" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                <Notebook className="w-4 h-4" />
              </div>
            </div>
          </div>

          <form onSubmit={handleFinishSetup} className="flex flex-col gap-5">
            
            {/* STEP 1: WORK AREA */}
            <div className={signupStep === 1 ? "flex flex-col gap-4" : "hidden"}>
              <div>
                <Label htmlFor="city">Cidade de Atuação</Label>
                <div className="mt-1">
                  <InputGroup className="rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                    <InputGroupAddon align="inline-start">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                    />
                  </InputGroup>
                </div>
              </div>

              <div>
                <Label htmlFor="neighborhoods">Bairros Atendidos (Separados por vírgula)</Label>
                <div className="mt-1">
                  <textarea
                    id="neighborhoods"
                    required
                    value={neighborhoodsInput}
                    onChange={(e) => setNeighborhoodsInput(e.target.value)}
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-20 transition-colors"
                    placeholder="Ex: Pinheiros, Vila Madalena, Butantã"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: CATEGORIES & PRICE */}
            <div className={signupStep === 2 ? "flex flex-col gap-4" : "hidden"}>
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Categorias CNH ministradas</span>
                <div className="grid grid-cols-4 gap-2">
                  {["A", "B", "C", "D"].map((cat) => {
                    const isSelected = categoriesSelected.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={`py-3 rounded-xl font-bold text-xs border text-center transition-all ${
                          isSelected 
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                            : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                        }`}
                      >
                        Cat. {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="hourlyRate">Valor da Hora/Aula (R$)</Label>
                <div className="mt-1">
                  <InputGroup className="rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                    <InputGroupAddon align="inline-start">
                      <span className="text-xs font-bold text-slate-500 pl-1">R$</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      id="hourlyRate"
                      required
                      value={hourlyRateInput}
                      onChange={(e) => setHourlyRateInput(e.target.value)}
                      placeholder="Ex: 120"
                      min="1"
                    />
                    <InputGroupAddon align="inline-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">/ 50 min</span>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* STEP 3: FLEET / VEHICLES */}
            <div className={signupStep === 3 ? "flex flex-col gap-4" : "hidden"}>
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Seus Veículos de Instrução</span>
                <p className="text-[10px] text-slate-400 font-medium mb-3">Adicione os carros ou motos que você ou a autoescola utilizam nas aulas práticas.</p>

                {vehiclesToCreate.length > 0 && (
                  <div className="flex flex-col gap-2 mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                    {vehiclesToCreate.map((v, i) => (
                      <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                        <div>
                          <p className="font-bold text-slate-805 dark:text-white">{v.name} {v.brand ? `(${v.brand})` : ""}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Categoria: {v.category} • Placa: {v.plate || "N/D"} {v.color ? `• Cor: ${v.color}` : ""}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVehicle(i)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <Label htmlFor="vehName" className="text-[10px]">Nome do Veículo</Label>
                      <input
                        type="text"
                        id="vehName"
                        value={newVehName}
                        onChange={(e) => setNewVehName(e.target.value)}
                        placeholder="Ex: Onix 1.0"
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehCategory" className="text-[10px]">Categoria CNH</Label>
                      <select
                        id="vehCategory"
                        value={newVehCategory}
                        onChange={(e) => setNewVehCategory(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      >
                        <option value="B">Cat. B (Carro)</option>
                        <option value="A">Cat. A (Moto)</option>
                        <option value="C">Cat. C (Caminhão)</option>
                        <option value="D">Cat. D (Ônibus)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="vehBrand" className="text-[10px] block truncate">Marca (opcional)</Label>
                      <input
                        type="text"
                        id="vehBrand"
                        value={newVehBrand}
                        onChange={(e) => setNewVehBrand(e.target.value)}
                        placeholder="Chevrolet"
                        className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehPlate" className="text-[10px] block truncate">Placa (opcional)</Label>
                      <input
                        type="text"
                        id="vehPlate"
                        value={newVehPlate}
                        onChange={(e) => setNewVehPlate(e.target.value)}
                        placeholder="ABC1D23"
                        className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehColor" className="text-[10px] block truncate">Cor (opcional)</Label>
                      <input
                        type="text"
                        id="vehColor"
                        value={newVehColor}
                        onChange={(e) => setNewVehColor(e.target.value)}
                        placeholder="Prata"
                        className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/50 dark:border-slate-800/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Veículo à Lista
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 4: BIO & MEETING POINTS */}
            <div className={signupStep === 4 ? "flex flex-col gap-4" : "hidden"}>
              <div>
                <Label htmlFor="bio">Biografia Profissional</Label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-28 transition-colors leading-relaxed"
                    placeholder="Conte sobre sua experiência, veículo utilizado e metodologia de ensino..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meetingPoints">Pontos de Encontro Principais (Separados por vírgula)</Label>
                <div className="mt-1">
                  <textarea
                    id="meetingPoints"
                    required
                    value={meetingPointsInput}
                    onChange={(e) => setMeetingPointsInput(e.target.value)}
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-20 transition-colors"
                    placeholder="Ex: Metrô Consolação, Shopping Boulevard, Praça Central"
                  />
                </div>
              </div>
            </div>

            {/* BUTTON BAR */}
            <div className="flex gap-3 mt-4">
              {signupStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold p-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 h-11 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}

              {signupStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5 h-11 cursor-pointer"
                >
                  Avançar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5 h-11 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      Finalizar e Acessar Painel
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
