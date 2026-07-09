"use client";

import React, { useState, useEffect } from "react";
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
import { updateSettingsAction, addVehicleAction, getVehicleBrandsAction, getVehicleModelsAction } from "@/app/actions";
import { useCep } from "@/lib/hooks/useCep";
import { z } from "zod";
import { formatCep, formatPlate } from "@/lib/formatters";
import Image from "next/image";
import { popularBrands, popularModelsByBrand } from "@/lib/autocomplete-data";

// Step-by-step validation schemas
const step1Schema = z.object({
  cep: z.string().min(8, "CEP inválido. Deve ter 8 dígitos."),
  street: z.string().min(2, "O logradouro deve ter pelo menos 2 caracteres."),
  number: z.string().min(1, "O número é obrigatório."),
  neighborhood: z.string().min(2, "O bairro deve ter pelo menos 2 caracteres."),
  city: z.string().min(2, "A cidade é obrigatória."),
  state: z.string().length(2, "O estado deve ter 2 letras."),
  neighborhoodsInput: z.string().min(2, "Informe pelo menos um bairro de atuação."),
});

const step2Schema = z.object({
  categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria."),
  classDuration: z.coerce.number().min(15, "A duração mínima de aula é de 15 minutos."),
});

const vehicleSchema = z.object({
  name: z.string().min(2, "O nome do veículo deve ter pelo menos 2 caracteres."),
  category: z.string().min(1, "A categoria é obrigatória."),
  brand: z.string().optional(),
  plate: z.string().refine((val) => {
    if (!val) return true;
    const clean = val.replace(/\s+/g, "").toUpperCase();
    return /^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/.test(clean);
  }, { message: "Placa inválida. Use o formato AAA-9999 ou Mercosul AAA-9A99." }).optional(),
  color: z.string().optional(),
  automatic: z.boolean().default(false),
});

const step4Schema = z.object({
  bio: z.string().min(10, "A biografia deve ter pelo menos 10 caracteres."),
  meetingPointsInput: z.string().min(2, "Informe pelo menos um ponto de encontro."),
});

export default function InstructorSetupPage() {
  const { settings } = useApp();

  const [signupStep, setSignupStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address states
  const [cep, setCep] = useState(settings?.address?.cep || "");
  const [street, setStreet] = useState(settings?.address?.street || "");
  const [number, setNumber] = useState(settings?.address?.number || "");
  const [complement, setComplement] = useState(settings?.address?.complement || "");
  const [neighborhood, setNeighborhood] = useState(settings?.address?.neighborhood || "");
  const [state, setState] = useState(settings?.address?.state || "");
  const [city, setCity] = useState(settings?.address?.city || settings?.city || "São Paulo");

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
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    const clean = formatted.replace(/\D/g, "");
    if (clean.length === 8) {
      handleCepSearch(clean);
    }
  };

  // Form states initialized with generic defaults, falling back to db defaults if loaded
  const [neighborhoodsInput, setNeighborhoodsInput] = useState(
    settings?.neighborhoods?.join(", ") || "Centro, Pinheiros, Jardins"
  );
  const [meetingPointsInput, setMeetingPointsInput] = useState(
    settings?.meetingPoints?.join(", ") || "Metrô Consolação, Shopping Cidade São Paulo"
  );
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(
    settings?.categories || ["B"]
  );
  const [classDurationInput, setClassDurationInput] = useState(
    settings?.classDuration ? settings.classDuration.toString() : "50"
  );
  const [categoryPrices, setCategoryPrices] = useState<Record<string, string>>(() => {
    if (settings?.categoryPrices) {
      const initial: Record<string, string> = {};
      Object.entries(settings.categoryPrices).forEach(([cat, val]) => {
        initial[cat] = (Number(val) / 100).toString();
      });
      return initial;
    }
    return {};
  });
  const [showCatDropdown, setShowCatDropdown] = useState(false);
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
    automatic: boolean;
  }[]>([]);

  const [newVehName, setNewVehName] = useState("");
  const [newVehPlate, setNewVehPlate] = useState("");
  const [newVehCategory, setNewVehCategory] = useState("B");
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehColor, setNewVehColor] = useState("");
  const [newVehAutomatic, setNewVehAutomatic] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);

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

  const handleAddVehicle = () => {
    const result = vehicleSchema.safeParse({
      name: newVehName,
      category: newVehCategory,
      brand: newVehBrand || undefined,
      plate: newVehPlate || undefined,
      color: newVehColor || undefined,
      automatic: newVehAutomatic,
    });

    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          errorMap[`vehicle_${String(err.path[0])}`] = err.message;
        }
      });
      setErrors(prev => ({
        ...prev,
        ...errorMap
      }));
      return;
    }

    // Clear any vehicle-specific errors
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.vehicle_name;
      delete copy.vehicle_brand;
      delete copy.vehicle_plate;
      delete copy.vehicle_color;
      delete copy.vehicle_automatic;
      return copy;
    });

    setVehiclesToCreate([
      ...vehiclesToCreate,
      {
        name: newVehName,
        plate: newVehPlate,
        category: newVehCategory,
        brand: newVehBrand,
        color: newVehColor,
        automatic: newVehAutomatic,
      }
    ]);
    setNewVehName("");
    setNewVehPlate("");
    setNewVehBrand("");
    setNewVehColor("");
    setNewVehAutomatic(false);
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
    if (signupStep === 1) {
      const result = step1Schema.safeParse({
        cep: cep.replace(/\D/g, ""),
        street,
        number,
        neighborhood,
        city,
        state,
        neighborhoodsInput,
      });

      if (!result.success) {
        const errorMap: Record<string, string> = {};
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            errorMap[err.path[0] as string] = err.message;
          }
        });
        setErrors(errorMap);
        return;
      }
      setErrors({});
      setSignupStep(2);
    } else if (signupStep === 2) {
      const result = step2Schema.safeParse({
        categories: categoriesSelected,
        classDuration: Number(classDurationInput),
      });

      if (!result.success) {
        const errorMap: Record<string, string> = {};
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            errorMap[err.path[0] as string] = err.message;
          }
        });
        setErrors(errorMap);
        return;
      }

      // Check that all selected categories have a valid price
      const priceErrors: Record<string, string> = {};
      categoriesSelected.forEach((cat) => {
        const price = categoryPrices[cat];
        if (!price || Number(price) <= 0) {
          priceErrors[`price_${cat}`] = `Informe o valor da hora/aula para a Cat. ${cat}`;
        }
      });

      if (Object.keys(priceErrors).length > 0) {
        setErrors(priceErrors);
        return;
      }

      setErrors({});
      setSignupStep(3);
    } else if (signupStep === 3) {
      setErrors({});
      setSignupStep(4);
    }
  };

  const handlePrevStep = () => {
    if (signupStep > 1) {
      setErrors({});
      setSignupStep(signupStep - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;
      e.preventDefault();
    }
  };

  const handleFinishSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = step4Schema.safeParse({
      bio,
      meetingPointsInput,
    });

    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          errorMap[err.path[0] as string] = err.message;
        }
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});
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
          color: v.color,
          automatic: v.automatic,
        });
      }

      // Convert categoryPrices to cents
      const categoryPricesCents: Record<string, number> = {};
      Object.entries(categoryPrices).forEach(([cat, val]) => {
        categoryPricesCents[cat] = brlToCents(Number(val));
      });

      // Save using Server Action
      await updateSettingsAction({
        id: settings?.id || "",
        organizationId: settings?.organizationId || "",
        city,
        neighborhoods,
        meetingPoints,
        hourlyRate: brlToCents(Number(categoryPrices[categoriesSelected[0]] || 120)),
        categories: categoriesSelected,
        bio,
        classDuration: Number(classDurationInput),
        categoryPrices: categoryPricesCents,
        workDays: settings?.workDays || [1, 2, 3, 4, 5, 6],
        workStart: settings?.workStart || "08:00",
        workEnd: settings?.workEnd || "18:00",
        lunchStart: settings?.lunchStart || "12:00",
        lunchEnd: settings?.lunchEnd || "13:30",
        address: {
          cep,
          state,
          city,
          neighborhood,
          street,
          number,
          complement: complement || undefined,
        },
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
        <div className="flex text-center w-[200px] h-[100px] relative mx-auto">
          <Image src="/img/pista-logo.png" alt="Logo Pista" fill className="object-contain" />
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
            {/* <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 1 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 2 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 3 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 4 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
            </div> */}

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

          <form onSubmit={handleFinishSetup} onKeyDown={handleKeyDown} className="flex flex-col gap-5">
            {/* STEP 1: WORK AREA */}
            <div className={signupStep === 1 ? "flex flex-col gap-4" : "hidden"}>
              <div>
                <Label htmlFor="cep">CEP de Atuação</Label>
                <div className="mt-1 flex gap-2">
                  <InputGroup className="flex-1 rounded-xl border bg-slate-50 dark:bg-slate-955 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                    <InputGroupAddon align="inline-start">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="cep"
                      required
                      maxLength={9}
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="Ex: 01310-100"
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    disabled={loadingCep || cep.replace(/\D/g, "").length !== 8}
                    onClick={() => handleCepSearch(cep)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-xs font-bold transition-all h-11 flex items-center justify-center cursor-pointer"
                  >
                    {loadingCep ? "Buscando..." : "Buscar CEP"}
                  </Button>
                </div>
                {errors.cep && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                    ⚠️ {errors.cep}
                  </p>
                )}
                {errorCep && !errors.cep && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                    ⚠️ {errorCep} (Preencha os campos abaixo manualmente se necessário)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="street" className="text-[10px]">Logradouro / Rua</Label>
                  <input
                    type="text"
                    id="street"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Av. Paulista"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                  />
                  {errors.street && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">
                      ⚠️ {errors.street}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="number" className="text-[10px]">Número</Label>
                  <input
                    type="text"
                    id="number"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="1000"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                  />
                  {errors.number && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">
                      ⚠️ {errors.number}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="neighborhood" className="text-[10px]">Bairro</Label>
                  <input
                    type="text"
                    id="neighborhood"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bela Vista"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                  />
                  {errors.neighborhood && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">
                      ⚠️ {errors.neighborhood}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="complement" className="text-[10px]">Complemento</Label>
                  <input
                    type="text"
                    id="complement"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto 42"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="city" className="text-[10px]">Cidade</Label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="São Paulo"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                  />
                  {errors.city && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">
                      ⚠️ {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state" className="text-[10px]">Estado</Label>
                  <input
                    type="text"
                    id="state"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                  />
                  {errors.state && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">
                      ⚠️ {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="neighborhoods">Bairros de Atuação Prática (Separados por vírgula)</Label>
                <div className="mt-1">
                  <textarea
                    id="neighborhoods"
                    required
                    value={neighborhoodsInput}
                    onChange={(e) => setNeighborhoodsInput(e.target.value)}
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-20 transition-colors"
                    placeholder="Ex: Pinheiros, Vila Madalena, Butantã"
                  />
                  {errors.neighborhoodsInput && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">
                      ⚠️ {errors.neighborhoodsInput}
                    </p>
                  )}
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
                        className={`py-3 rounded-xl font-bold text-xs border text-center transition-all ${isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-955 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }`}
                      >
                        Cat. {cat}
                      </button>
                    );
                  })}
                </div>
                {errors.categories && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                    ⚠️ {errors.categories}
                  </p>
                )}
              </div>

              {/* Lesson Duration */}
              <div>
                <Label htmlFor="classDuration">Duração da Aula (Minutos)</Label>
                <div className="mt-1">
                  <InputGroup className="rounded-xl border bg-slate-50 dark:bg-slate-955 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                    <InputGroupInput
                      type="number"
                      id="classDuration"
                      required
                      value={classDurationInput}
                      onChange={(e) => setClassDurationInput(e.target.value)}
                      placeholder="Ex: 50"
                      min="15"
                    />
                    <InputGroupAddon align="inline-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">minutos</span>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.classDuration && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                      ⚠️ {errors.classDuration}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Prices per Selected Category */}
              {categoriesSelected.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-200/40 dark:border-slate-850 pt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preço da Hora/Aula por Categoria</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoriesSelected.map((cat) => (
                      <div key={cat}>
                        <Label htmlFor={`price_${cat}`} className="text-[10px]">Categoria {cat} (R$)</Label>
                        <div className="mt-1">
                          <InputGroup className="rounded-xl border bg-slate-50 dark:bg-slate-955 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                            <InputGroupAddon align="inline-start">
                              <span className="text-xs font-bold text-slate-500 pl-1">R$</span>
                            </InputGroupAddon>
                            <InputGroupInput
                              type="number"
                              id={`price_${cat}`}
                              required
                              value={categoryPrices[cat] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCategoryPrices(prev => ({
                                  ...prev,
                                  [cat]: val
                                }));
                              }}
                              placeholder="Ex: 120"
                              min="1"
                            />
                            <InputGroupAddon align="inline-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">/ {classDurationInput} min</span>
                            </InputGroupAddon>
                          </InputGroup>
                          {errors[`price_${cat}`] && (
                            <p className="text-[9px] text-rose-500 font-bold mt-1 ml-1">
                              ⚠️ {errors[`price_${cat}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                          <p className="text-[10px] text-slate-500 font-medium">
                            Categoria: {v.category} • Placa: {v.plate || "N/D"} {v.color ? `• Cor: ${v.color}` : ""} • Câmbio: {v.automatic ? "Automático" : "Manual"}
                          </p>
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
                    {/* Brand Input (Marca) - First Input */}
                    <div className="relative">
                      <Label htmlFor="vehBrand" className="text-[10px]">Marca</Label>
                      <input
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
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
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
                      {errors.vehicle_brand && (
                        <p className="text-[9px] text-rose-500 font-bold mt-1">
                          ⚠️ {errors.vehicle_brand}
                        </p>
                      )}
                    </div>

                    {/* Vehicle name / Model Input */}
                    <div className="relative">
                      <Label htmlFor="vehName" className="text-[10px]">Nome do Veículo / Modelo</Label>
                      <input
                        type="text"
                        id="vehName"
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
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
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
                      {errors.vehicle_name && (
                        <p className="text-[9px] text-rose-500 font-bold mt-1">
                          ⚠️ {errors.vehicle_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <Label className="text-[10px]">Categoria CNH</Label>
                      <div className="mt-1 relative">
                        <button
                          type="button"
                          onClick={() => setShowCatDropdown(!showCatDropdown)}
                          className="w-full h-8.5 px-3 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white flex items-center justify-between cursor-pointer"
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
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 transition-colors flex items-center justify-between cursor-pointer ${newVehCategory === opt.value ? "bg-slate-50 dark:bg-slate-850 font-bold" : ""
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
                      <Label htmlFor="vehPlate" className="text-[10px] block truncate">Placa (opcional)</Label>
                      <input
                        type="text"
                        id="vehPlate"
                        value={newVehPlate}
                        onChange={(e) => setNewVehPlate(formatPlate(e.target.value))}
                        placeholder="ABC-1D23"
                        className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
                      {errors.vehicle_plate && (
                        <p className="text-[9px] text-rose-500 font-bold mt-1">
                          ⚠️ {errors.vehicle_plate}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="vehColor" className="text-[10px] block truncate">Cor (opcional)</Label>
                      <input
                        type="text"
                        id="vehColor"
                        value={newVehColor}
                        onChange={(e) => setNewVehColor(e.target.value)}
                        placeholder="Prata"
                        className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 dark:text-white"
                      />
                      {errors.vehicle_color && (
                        <p className="text-[9px] text-rose-500 font-bold mt-1">
                          ⚠️ {errors.vehicle_color}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Transmission Toggle Field */}
                  <div>
                    <Label className="text-[10px] block mb-1">Câmbio / Transmissão</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setNewVehAutomatic(false)}
                        className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${!newVehAutomatic
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                          }`}
                      >
                        Manual
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewVehAutomatic(true)}
                        className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${newVehAutomatic
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                          : "bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                          }`}
                      >
                        Automático
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-50 dark:text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-900 dark:border-white transition-all active:scale-[0.98] mt-1.5"
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
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-28 transition-colors leading-relaxed"
                    placeholder="Conte sobre sua experiência, veículo utilizado e metodologia de ensino..."
                  />
                  {errors.bio && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                      ⚠️ {errors.bio}
                    </p>
                  )}
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
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-20 transition-colors"
                    placeholder="Ex: Metrô Consolação, Shopping Boulevard, Praça Central"
                  />
                  {errors.meetingPointsInput && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">
                      ⚠️ {errors.meetingPointsInput}
                    </p>
                  )}
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
                  className="flex-1 bg-slate-100 border border-slate-200 dark:bg-slate-955 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold p-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 h-11 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}

              {signupStep < 4 ? (
                <Button
                  key="next-step-button"
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5 h-11 cursor-pointer"
                >
                  Avançar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  key="finish-setup-button"
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
