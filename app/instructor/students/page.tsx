"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/context";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  phone: z.string().min(8, "Telefone inválido ou incompleto"),
  email: z.string().email("Insira um endereço de e-mail válido"),
  meetingPoint: z.string().min(2, "Informe um ponto de encontro válido"),
});

type StudentFormInputs = z.infer<typeof studentSchema>;

export default function InstructorStudents() {
  const { students, addStudent } = useApp();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormInputs>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      category: "B (Carro)",
      phone: "",
      email: "",
      meetingPoint: "Centro"
    }
  });

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const addStudentMutation = useMutation({
    mutationFn: async (data: StudentFormInputs) => {
      addStudent({
        name: data.name,
        category: data.category,
        phone: data.phone,
        email: data.email,
        meetingPoint: data.meetingPoint,
        pendingPayment: 0,
      });
      return true;
    },
    onSuccess: () => {
      reset();
      setShowAddModal(false);
    }
  });

  const onSubmit = (data: StudentFormInputs) => {
    if (!data.name) return;
    addStudentMutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Lista de Alunos</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Gerencie o progresso e dados de contato dos seus alunos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 cursor-pointer text-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Aluno
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar aluno por nome..."
          className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200/40 dark:border-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors shadow-xs"
        />
      </div>

      {/* Students List */}
      <section className="flex flex-col gap-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <p className="text-xs text-slate-400 font-medium">Nenhum aluno encontrado para sua busca.</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/instructor/students/${student.id}`}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:border-blue-200 dark:hover:border-blue-900 hover:scale-[1.005] active:scale-[0.995] transition-all duration-200 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <img
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-slate-800"
                  src={student.photoUrl}
                />
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs group-hover:text-blue-600 transition-colors">
                    {student.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">{student.category} • {student.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Progresso prático</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-855 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{student.progress}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] uppercase tracking-wider bg-slate-50 border border-slate-200/40 dark:bg-slate-950/40 dark:border-slate-900 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400 font-bold">
                    {student.completedClasses}/{student.totalClasses} Aulas
                  </span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Add Student Modal */}
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
              Adicionar Novo Aluno
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="studentName" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Nome Completo</Label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="studentName"
                    placeholder="Nome do Aluno"
                    className={`rounded-xl h-10 text-xs ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="studentCategory" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Categoria de CNH</Label>
                <div className="mt-1">
                  <select
                    id="studentCategory"
                    className={`w-full rounded-xl border p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none transition-colors duration-200 cursor-pointer font-medium ${errors.category ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-600 dark:focus:border-slate-700"}`}
                    {...register("category")}
                  >
                    <option value="B (Carro)">B (Carro)</option>
                    <option value="A (Moto)">A (Moto)</option>
                    <option value="AB (Carro e Moto)">AB (Carro e Moto)</option>
                  </select>
                </div>
                {errors.category && (
                  <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1.5">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="studentPhone" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Telefone</Label>
                  <div className="mt-1">
                    <Input
                      type="tel"
                      id="studentPhone"
                      placeholder="(11) 99999-9999"
                      className={`rounded-xl h-10 text-xs ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1.5">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="studentMeetingPoint" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Ponto de Encontro</Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="studentMeetingPoint"
                      placeholder="Centro, Residência..."
                      className={`rounded-xl h-10 text-xs ${errors.meetingPoint ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("meetingPoint")}
                    />
                  </div>
                  {errors.meetingPoint && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1.5">
                      {errors.meetingPoint.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="studentEmail" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">E-mail</Label>
                <div className="mt-1">
                  <Input
                    type="email"
                    id="studentEmail"
                    placeholder="aluno@email.com"
                    className={`rounded-xl h-10 text-xs ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={addStudentMutation.isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs h-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2 rounded-xl uppercase tracking-wider text-[10px]"
              >
                {addStudentMutation.isPending ? "Cadastrando..." : "Cadastrar Aluno"}
              </Button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
