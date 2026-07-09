"use client";

import { use, useState } from "react";
import { useApp } from "@/lib/context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCentsToBRL } from "@/lib/utils";

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { students, classes, confirmClass, completeClass, vehicles, addVehicle, deleteVehicle } = useApp();

  const student = students.find((s) => s.id === resolvedParams.id);
  const studentClasses = classes.filter((c) => c.studentId === resolvedParams.id);

  const [notes, setNotes] = useState(
    student?.id === "mariana-costa"
      ? "Melhorando o controle de embreagem em subidas. Precisa praticar mais manobras de baliza. Ótima atenção geral no trânsito."
      : student?.id === "rafael-souza"
      ? "Dificuldade na troca de marchas (redução). Boa postura ao volante, necessita de calma nas rotatórias."
      : "Boa condução. Pronto para agendar o exame simulado de trânsito."
  );

  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Vehicle states
  const [newVehName, setNewVehName] = useState("");
  const [newVehPlate, setNewVehPlate] = useState("");
  const [newVehCategory, setNewVehCategory] = useState("B");
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehColor, setNewVehColor] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !newVehName.trim()) return;
    setIsAdding(true);
    try {
      await addVehicle({
        studentId: student.id,
        name: newVehName,
        plate: newVehPlate || undefined,
        category: newVehCategory,
        brand: newVehBrand || undefined,
        color: newVehColor || undefined,
      });
      setNewVehName("");
      setNewVehPlate("");
      setNewVehBrand("");
      setNewVehColor("");
      setNewVehCategory("B");
      setShowAddForm(false);
    } catch (err) {
      console.error("Erro ao adicionar veículo:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-semibold">Aluno não encontrado.</p>
        <Link href="/instructor/students" className="text-blue-600 font-bold hover:underline mt-4 block">
          Voltar para Lista
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{student.name}</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Ficha cadastral e progresso prático do aluno</p>
        </div>
      </div>

      {/* Profile Info Card */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          alt={student.name}
          className="w-20 h-20 rounded-full object-cover border border-slate-200/50 dark:border-slate-850 shadow-xs"
          src={student.photoUrl}
        />
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{student.name}</h3>
            <span className="inline-block bg-blue-50 border border-blue-100/50 text-blue-650 dark:bg-blue-950/30 dark:text-blue-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mx-auto md:mx-0">
              Cat. {student.category}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Matrícula realizada em 12 de Outubro de 2023</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5 max-w-lg mx-auto md:mx-0 text-left">
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Telefone</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250">{student.phone}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">E-mail</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate block">{student.email}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Ponto de Encontro</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250">{student.meetingPoint}</span>
            </div>
          </div>

          <div className="flex gap-2.5 justify-center md:justify-start mt-6">
            <a
              href={`tel:${student.phone}`}
              className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-250/60 dark:border-slate-850 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ligar
            </a>
            <a
              href={`https://wa.me/${student.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.322 5.325 0 11.85 0a11.78 11.78 0 018.36 3.473c2.228 2.224 3.455 5.183 3.454 8.334-.003 6.529-5.326 11.852-11.85 11.852-2.001-.001-3.969-.51-5.753-1.48L0 24zm6.59-4.846c1.672.993 3.31 1.52 5.2.19 5.201 0 9.432-4.232 9.434-9.434.002-2.521-.98-4.89-2.766-6.678A9.36 9.36 0 0011.85 2.418C6.65 2.418 2.42 6.649 2.418 11.85c-.001 1.996.536 3.935 1.554 5.624L3 21.082l4.137-.928z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Grid: Progress & Financial */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Progress Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[180px]">
          <div>
            <h4 className="font-bold text-slate-850 dark:text-white uppercase tracking-wider text-[9px] mb-3">Progresso de Aulas Práticas</h4>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-500">{student.progress}%</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                {student.completedClasses} de {student.totalClasses} Concluídas
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>
          <div className="border-t border-slate-200/30 dark:border-slate-850 mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-400">
            <span className="font-medium">Exame Estimado</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Meados de Junho/2026</span>
          </div>
        </div>

        {/* Financial Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between items-center text-center h-[180px]">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            student.pendingPayment > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
          }`}>
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {student.pendingPayment > 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          
          <div className="mt-2 flex flex-col items-center">
            <h4 className="font-bold text-slate-850 dark:text-white uppercase tracking-wider text-[9px] mb-1">Status Financeiro</h4>
            {student.pendingPayment > 0 ? (
              <>
                <span className="bg-amber-50 border border-amber-100/50 text-amber-750 dark:bg-amber-950/30 dark:text-amber-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Fatura Pendente
                </span>
                <p className="text-lg font-black text-amber-600 dark:text-amber-500">{formatCentsToBRL(student.pendingPayment)}</p>
              </>
            ) : (
              <>
                <span className="bg-emerald-50 border border-emerald-100/50 text-emerald-755 dark:bg-emerald-950/30 dark:text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Totalmente Pago
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Pacote contratado 100% quitado</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Veículos do Aluno */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-bold text-slate-850 dark:text-white uppercase tracking-wider text-[9px]">Veículo(s) Próprio(s) do Aluno</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Veículos trazidos pelo próprio aluno para as aulas práticas.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs text-blue-600 dark:text-blue-500 font-bold hover:underline cursor-pointer"
          >
            {showAddForm ? "Cancelar" : "+ Adicionar Veículo"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddVehicle} className="mb-4 bg-slate-55/60 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850/80 flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[8px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider block mb-1">Nome do Veículo</label>
                <input
                  type="text"
                  required
                  value={newVehName}
                  onChange={(e) => setNewVehName(e.target.value)}
                  placeholder="Ex: Fiat Uno 1.0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-650"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider block mb-1">Categoria</label>
                <select
                  value={newVehCategory}
                  onChange={(e) => setNewVehCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-650"
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
                <label className="text-[8px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider block mb-1">Marca</label>
                <input
                  type="text"
                  value={newVehBrand}
                  onChange={(e) => setNewVehBrand(e.target.value)}
                  placeholder="Fiat"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-650"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider block mb-1">Placa</label>
                <input
                  type="text"
                  value={newVehPlate}
                  onChange={(e) => setNewVehPlate(e.target.value)}
                  placeholder="XYZ9W87"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-655"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider block mb-1">Cor</label>
                <input
                  type="text"
                  value={newVehColor}
                  onChange={(e) => setNewVehColor(e.target.value)}
                  placeholder="Vermelho"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-655"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-md shadow-blue-500/10 transition-colors disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] duration-150"
            >
              {isAdding ? "Adicionando..." : "Salvar Veículo"}
            </button>
          </form>
        )}

        {vehicles.filter(v => v.studentId === student.id).length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-550 font-semibold py-2">Nenhum veículo próprio registrado para este aluno. Ele utilizará a frota da autoescola.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {vehicles.filter(v => v.studentId === student.id).map(v => (
              <div key={v.id} className="flex justify-between items-center p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-900 text-xs hover:border-slate-300 dark:hover:border-slate-800 transition-colors">
                <div>
                  <p className="font-bold text-slate-850 dark:text-slate-200">{v.name} {v.brand ? `(${v.brand})` : ""}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Categoria: {v.category} • Placa: {v.plate || "N/D"} {v.color ? `• Cor: ${v.color}` : ""}</p>
                </div>
                <button
                  onClick={() => deleteVehicle(v.id)}
                  className="text-xs text-red-550 hover:text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Instructor Notes */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-855 dark:text-white uppercase tracking-wider text-[9px]">Observações do Instrutor</h4>
          <button
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            className="text-xs text-blue-600 dark:text-blue-500 font-bold hover:underline"
          >
            {isEditingNotes ? "Salvar" : "Editar"}
          </button>
        </div>

        {isEditingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-24 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:outline-none focus:border-blue-600 transition-colors font-medium leading-relaxed"
          />
        ) : (
          <p className="text-xs text-slate-650 dark:text-slate-400 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/40 dark:border-slate-900 leading-relaxed font-semibold">
            {notes}
          </p>
        )}
      </section>

      {/* Student Class History */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <h4 className="font-bold text-slate-855 dark:text-white uppercase tracking-wider text-[9px] mb-4">Histórico de Aulas</h4>
        {studentClasses.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold py-4">Nenhuma aula registrada para este aluno.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {studentClasses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-900 hover:border-blue-200 dark:hover:border-blue-900 hover:scale-[1.005] active:scale-[0.995] transition-all duration-200 shadow-xs"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200">{c.type}</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                    {new Date(c.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })} • {c.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                    c.status === "Confirmada" ? "bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/30 dark:text-blue-450" :
                    c.status === "Concluída" ? "bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-950/30 dark:text-emerald-400" :
                    c.status === "Cancelada" ? "bg-red-50 text-red-700 border-red-100/50 dark:bg-red-950/30 dark:text-red-400" :
                    "bg-yellow-50 text-yellow-750 border-yellow-100/50 dark:bg-yellow-950/30 dark:text-yellow-400"
                  }`}>
                    {c.status}
                  </span>

                  {c.status === "Pendente" && (
                    <button
                      onClick={() => confirmClass(c.id)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                    >
                      Confirmar
                    </button>
                  )}
                  {c.status === "Confirmada" && (
                    <button
                      onClick={() => completeClass(c.id)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-755 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
