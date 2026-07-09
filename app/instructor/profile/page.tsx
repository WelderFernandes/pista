"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/context";
import { getVehicleBrandsAction, getVehicleModelsAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/user";
import { User } from "@/generated";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon, Eye as EyeIcon, PencilSimple as PencilIcon } from "@phosphor-icons/react";

export default function InstructorProfile() {
  const { settings, vehicles, addVehicle, updateVehicle } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  const [newBrand, setNewBrand] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("B");
  const [newPlate, setNewPlate] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newAutomatic, setNewAutomatic] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // DB Autocomplete states
  const [dbBrands, setDbBrands] = useState<{ id: string; name: string; type: string }[]>([]);
  const [dbModels, setDbModels] = useState<{ id: string; name: string; type: string }[]>([]);

  // Load brands on modal open
  useEffect(() => {
    if (isModalOpen || isEditModalOpen) {
      getVehicleBrandsAction()
        .then(setDbBrands)
        .catch((err) => console.error("Erro ao buscar marcas:", err));
    }
  }, [isModalOpen, isEditModalOpen]);

  // Load models on brand change
  useEffect(() => {
    const brandTrimmed = newBrand.trim();
    if (brandTrimmed) {
      getVehicleModelsAction(brandTrimmed)
        .then(setDbModels)
        .catch((err) => console.error("Erro ao buscar modelos:", err));
    } else {
      setDbModels([]);
    }
  }, [newBrand]);

  const handleViewVehicle = (v: any) => {
    setSelectedVehicle(v);
    setIsViewModalOpen(true);
  };

  const handleEditVehicle = (v: any) => {
    setSelectedVehicle(v);
    setNewBrand(v.brand || "");
    setNewName(v.name);
    setNewCategory(v.category);
    setNewPlate(v.plate || "");
    setNewColor(v.color || "");
    setNewAutomatic(v.automatic);
    setIsEditModalOpen(true);
  };

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await addVehicle({
        name: newName,
        plate: newPlate || undefined,
        category: newCategory,
        brand: newBrand || undefined,
        color: newColor || undefined,
        automatic: newAutomatic,
      });
      setNewName("");
      setNewBrand("");
      setNewPlate("");
      setNewColor("");
      setNewCategory("B");
      setNewAutomatic(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar veículo:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !newName.trim()) return;
    setIsAdding(true);
    try {
      await updateVehicle(selectedVehicle.id, {
        name: newName,
        plate: newPlate || undefined,
        category: newCategory,
        brand: newBrand || undefined,
        color: newColor || undefined,
        automatic: newAutomatic,
      });
      setNewName("");
      setNewBrand("");
      setNewPlate("");
      setNewColor("");
      setNewCategory("B");
      setNewAutomatic(false);
      setSelectedVehicle(null);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Erro ao editar veículo:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const [user, setUser] = useState<User | null>(null);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user.id) {
      getCurrentUser({ id: session.user.id }).then((usr) => {
        setUser(usr);
      });
    }
  }, [session]);

  const userName = user?.name || session?.user?.name || "Instrutor";
  const userEmail = user?.email || session?.user?.email || "";
  const userImage = user?.image || session?.user?.image;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Perfil e Veículo</h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Gerencie suas informações profissionais e dados do automóvel</p>
      </div>

      {/* Instructor Information */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="w-16 h-16 border border-slate-200/50 dark:border-slate-800 shadow-xs">
          {userImage && <AvatarImage src={userImage} alt={userName} />}
          <AvatarFallback className="bg-slate-100 dark:bg-slate-950 text-slate-550 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-slate-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-base font-black text-slate-900 dark:text-white">{userName}</h3>
          <p className="text-[10px] text-blue-650 dark:text-blue-400 font-bold uppercase tracking-wider mt-0.5">Instrutor Credenciado Detran • Credencial #94827-C</p>
          
          <div className="grid grid-cols-2 gap-4 mt-5 text-left max-w-md">
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">E-mail</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block truncate">{userEmail}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Categorias Habilitadas</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250">
                {settings?.categories && settings.categories.length > 0
                  ? settings.categories.join(", ")
                  : "B"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle details */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center mb-5 border-b border-slate-200/30 dark:border-slate-850 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider text-[9px]">Veículos de Instrução ({vehicles.length})</h3>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/50 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Frota Ativa
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase tracking-wider"
          >
            + Adicionar Veículo
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nenhum veículo cadastrado na frota</p>
            <p className="text-[10px] text-slate-400 mt-1">Clique em + Adicionar Veículo para cadastrar o primeiro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-slate-50/50 dark:bg-slate-955/20 border border-slate-200/40 dark:border-slate-850 rounded-2xl p-4 transition-all hover:border-slate-350 dark:hover:border-slate-750 relative overflow-hidden group min-h-[92px] flex flex-col justify-center"
              >
                {/* Content block that blurs on hover */}
                <div className="transition-all duration-300 group-hover:blur-[2px] group-hover:opacity-30 flex flex-col gap-2.5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-850 dark:text-white">
                      {v.brand || ""} {v.name}
                    </span>
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/50 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Cat. {v.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="bg-slate-100 text-slate-650 dark:bg-slate-850 dark:text-slate-350 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Placa: {v.plate || "N/D"}
                    </span>
                    {v.color && (
                      <span className="bg-slate-100 text-slate-650 dark:bg-slate-850 dark:text-slate-350 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Cor: {v.color}
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-650 dark:bg-slate-850 dark:text-slate-350 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {v.automatic ? "Automático" : "Manual"}
                    </span>
                  </div>
                </div>

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-slate-900/5 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5 z-10 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => handleViewVehicle(v)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:scale-[1.08] active:scale-[0.95] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Visualizar"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditVehicle(v)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:scale-[1.08] active:scale-[0.95] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Editar"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Vehicle Modal Overlay */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full animate-scale-up">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Novo Veículo na Frota</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Brand input (Marca) */}
                <div className="relative">
                  <Label htmlFor="modalBrand" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Marca</Label>
                  <Input
                    type="text"
                    id="modalBrand"
                    value={newBrand}
                    onFocus={() => {
                      setShowBrandSuggestions(true);
                      setShowNameSuggestions(false);
                    }}
                    onChange={(e) => {
                      setNewBrand(e.target.value);
                      setShowBrandSuggestions(true);
                    }}
                    placeholder="Ex: Chevrolet"
                    className="rounded-xl text-xs h-10"
                  />
                  {showBrandSuggestions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowBrandSuggestions(false)} />
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                        {dbBrands
                          .filter((b) => {
                            const matchesType =
                              newCategory === "A"
                                ? b.type === "motorcycle" || b.type === "both"
                                : b.type === "car" || b.type === "both";
                            const matchesSearch = b.name.toLowerCase().includes(newBrand.toLowerCase());
                            return matchesType && matchesSearch;
                          })
                          .map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setNewBrand(b.name);
                                setShowBrandSuggestions(false);
                                if (b.type === "motorcycle") {
                                  setNewCategory("A");
                                } else if (b.type === "car") {
                                  setNewCategory("B");
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-850 dark:text-slate-250 cursor-pointer"
                            >
                              {b.name}
                            </button>
                          ))}
                        {dbBrands.filter((b) => {
                          const matchesType =
                            newCategory === "A"
                              ? b.type === "motorcycle" || b.type === "both"
                              : b.type === "car" || b.type === "both";
                          const matchesSearch = b.name.toLowerCase().includes(newBrand.toLowerCase());
                          return matchesType && matchesSearch;
                        }).length === 0 && (
                          <div className="px-3 py-2 text-xs text-slate-400">
                            Nenhuma sugestão
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Model input (Modelo) */}
                <div className="relative">
                  <Label htmlFor="modalName" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Modelo</Label>
                  <Input
                    type="text"
                    id="modalName"
                    required
                    value={newName}
                    onFocus={() => {
                      setShowNameSuggestions(true);
                      setShowBrandSuggestions(false);
                    }}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setShowNameSuggestions(true);
                    }}
                    placeholder="Ex: Onix 1.0"
                    className="rounded-xl text-xs h-10"
                  />
                  {showNameSuggestions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNameSuggestions(false)} />
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                        {(() => {
                          const filtered = dbModels.filter((m) => {
                            const matchesType =
                              newCategory === "A"
                                ? m.type === "motorcycle"
                                : m.type === "car";
                            const matchesSearch = m.name.toLowerCase().includes(newName.toLowerCase());
                            return matchesType && matchesSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="px-3 py-2 text-xs text-slate-400">
                                Nenhuma sugestão
                              </div>
                            );
                          }

                          return filtered.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setNewName(m.name);
                                setShowNameSuggestions(false);
                                if (m.type === "motorcycle") {
                                  setNewCategory("A");
                                } else {
                                  setNewCategory("B");
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-850 dark:text-slate-250 cursor-pointer"
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

              <div className="grid grid-cols-3 gap-2">
                {/* Custom Category Dropdown */}
                <div className="relative">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Categoria CNH</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCatDropdown(!showCatDropdown)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white flex items-center justify-between cursor-pointer text-left font-medium"
                    >
                      <span>{newCategory}</span>
                      <span className="text-slate-400 text-[8px]">▼</span>
                    </button>
                    {showCatDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCatDropdown(false)} />
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                          {["B", "A", "C", "D"].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setNewCategory(cat);
                                setShowCatDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 cursor-pointer font-bold ${
                                newCategory === cat ? "bg-slate-50 dark:bg-slate-850" : ""
                              }`}
                            >
                              Cat. {cat}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Placa */}
                <div>
                  <Label htmlFor="modalPlate" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Placa</Label>
                  <Input
                    type="text"
                    id="modalPlate"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                    placeholder="ABC1D23"
                    className="rounded-xl text-xs h-10"
                  />
                </div>

                {/* Cor */}
                <div>
                  <Label htmlFor="modalColor" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Cor</Label>
                  <Input
                    type="text"
                    id="modalColor"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Ex: Prata"
                    className="rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              {/* Transmission Type Selector */}
              <div>
                <Label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Câmbio / Transmissão</Label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewAutomatic(false)}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      !newAutomatic
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAutomatic(true)}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      newAutomatic
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    Automático
                  </button>
                </div>
              </div>

              {/* Confirm submit button */}
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs h-10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2 rounded-xl uppercase tracking-wider text-[10px]"
              >
                {isAdding ? "Adicionando..." : "Confirmar Cadastro"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Vehicle Modal Overlay */}
      {isViewModalOpen && mounted && selectedVehicle && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full animate-scale-up">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Detalhes do Veículo</h3>
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedVehicle(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-850 flex flex-col gap-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Veículo</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    {selectedVehicle.brand || ""} {selectedVehicle.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Categoria CNH</span>
                    <div>
                      <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/50 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Cat. {selectedVehicle.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Placa</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedVehicle.plate || "Não Informada"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Cor</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedVehicle.color || "Não Informada"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Câmbio</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedVehicle.automatic ? "Automático" : "Manual"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Vehicle Modal Overlay */}
      {isEditModalOpen && mounted && selectedVehicle && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full animate-scale-up">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Editar Veículo</h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedVehicle(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleEditVehicleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Brand input (Marca) */}
                <div className="relative">
                  <Label htmlFor="editBrand" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Marca</Label>
                  <Input
                    type="text"
                    id="editBrand"
                    value={newBrand}
                    onFocus={() => {
                      setShowBrandSuggestions(true);
                      setShowNameSuggestions(false);
                    }}
                    onChange={(e) => {
                      setNewBrand(e.target.value);
                      setShowBrandSuggestions(true);
                    }}
                    placeholder="Ex: Chevrolet"
                    className="rounded-xl text-xs h-10"
                  />
                  {showBrandSuggestions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowBrandSuggestions(false)} />
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                        {dbBrands
                          .filter((b) => {
                            const matchesType =
                              newCategory === "A"
                                ? b.type === "motorcycle" || b.type === "both"
                                : b.type === "car" || b.type === "both";
                            const matchesSearch = b.name.toLowerCase().includes(newBrand.toLowerCase());
                            return matchesType && matchesSearch;
                          })
                          .map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setNewBrand(b.name);
                                setShowBrandSuggestions(false);
                                if (b.type === "motorcycle") {
                                  setNewCategory("A");
                                } else if (b.type === "car") {
                                  setNewCategory("B");
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 cursor-pointer"
                            >
                              {b.name}
                            </button>
                          ))}
                        {dbBrands.filter((b) => {
                          const matchesType =
                            newCategory === "A"
                              ? b.type === "motorcycle" || b.type === "both"
                              : b.type === "car" || b.type === "both";
                          const matchesSearch = b.name.toLowerCase().includes(newBrand.toLowerCase());
                          return matchesType && matchesSearch;
                        }).length === 0 && (
                          <div className="px-3 py-2 text-xs text-slate-400">
                            Nenhuma sugestão
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Model input (Modelo) */}
                <div className="relative">
                  <Label htmlFor="editName" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Modelo</Label>
                  <Input
                    type="text"
                    id="editName"
                    required
                    value={newName}
                    onFocus={() => {
                      setShowNameSuggestions(true);
                      setShowBrandSuggestions(false);
                    }}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setShowNameSuggestions(true);
                    }}
                    placeholder="Ex: Onix 1.0"
                    className="rounded-xl text-xs h-10"
                  />
                  {showNameSuggestions && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNameSuggestions(false)} />
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                        {(() => {
                          const filtered = dbModels.filter((m) => {
                            const matchesType =
                              newCategory === "A"
                                ? m.type === "motorcycle"
                                : m.type === "car";
                            const matchesSearch = m.name.toLowerCase().includes(newName.toLowerCase());
                            return matchesType && matchesSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="px-3 py-2 text-xs text-slate-400">
                                Nenhuma sugestão
                              </div>
                            );
                          }

                          return filtered.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setNewName(m.name);
                                setShowNameSuggestions(false);
                                if (m.type === "motorcycle") {
                                  setNewCategory("A");
                                } else {
                                  setNewCategory("B");
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 cursor-pointer"
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

              <div className="grid grid-cols-3 gap-2">
                {/* Custom Category Dropdown */}
                <div className="relative">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Categoria CNH</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCatDropdown(!showCatDropdown)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white flex items-center justify-between cursor-pointer text-left font-medium"
                    >
                      <span>{newCategory}</span>
                      <span className="text-slate-400 text-[8px]">▼</span>
                    </button>
                    {showCatDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCatDropdown(false)} />
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 py-1">
                          {["B", "A", "C", "D"].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setNewCategory(cat);
                                setShowCatDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 cursor-pointer font-bold ${
                                newCategory === cat ? "bg-slate-50 dark:bg-slate-850" : ""
                              }`}
                            >
                              Cat. {cat}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Placa */}
                <div>
                  <Label htmlFor="editPlate" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Placa</Label>
                  <Input
                    type="text"
                    id="editPlate"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                    placeholder="ABC1D23"
                    className="rounded-xl text-xs h-10"
                  />
                </div>

                {/* Cor */}
                <div>
                  <Label htmlFor="editColor" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Cor</Label>
                  <Input
                    type="text"
                    id="editColor"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Ex: Prata"
                    className="rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              {/* Transmission Type Selector */}
              <div>
                <Label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Câmbio / Transmissão</Label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewAutomatic(false)}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      !newAutomatic
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAutomatic(true)}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      newAutomatic
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    Automático
                  </button>
                </div>
              </div>

              {/* Confirm submit button */}
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs h-10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2 rounded-xl uppercase tracking-wider text-[10px]"
              >
                {isAdding ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
