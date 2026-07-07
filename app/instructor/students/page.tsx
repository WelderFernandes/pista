"use client";

import { useState } from "react";
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
      // Aqui encapsulamos o cadastro simulando uma operação assíncrona
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
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Lista de Alunos</h2>
          <p className="text-slate-500 text-sm">Gerencie o progresso e dados de contato dos seus alunos.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Aluno
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar aluno por nome..."
          className="w-full pl-10 pr-4 py-3 rounded-sm border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Students List */}
      <section className="flex flex-col gap-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-sm text-slate-400 font-medium">Nenhum aluno encontrado para sua busca.</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/instructor/students/${student.id}`}
              className="bg-white p-4 rounded-sm border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between gap-4 shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <img
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  src={student.photoUrl}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {student.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{student.category} • {student.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block font-semibold">Progresso prático</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-slate-700">{student.progress}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">
                    {student.completedClasses}/{student.totalClasses} Aulas
                  </span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Adicionar Novo Aluno</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="studentName">Nome Completo</Label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="studentName"
                    placeholder="Nome do Aluno"
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="studentCategory">Categoria de CNH</Label>
                <div className="mt-1">
                  <select
                    id="studentCategory"
                    className={`w-full rounded-sm border p-2.5 text-xs text-slate-850 dark:text-white focus:outline-none transition-colors duration-200 ${errors.category ? "border-red-500 focus:border-red-500" : "border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-slate-350 dark:focus:border-slate-700"}`}
                    {...register("category")}
                  >
                    <option value="B (Carro)">B (Carro)</option>
                    <option value="A (Moto)">A (Moto)</option>
                    <option value="AB (Carro e Moto)">AB (Carro e Moto)</option>
                  </select>
                </div>
                {errors.category && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="studentPhone">Telefone</Label>
                  <div className="mt-1">
                    <Input
                      type="tel"
                      id="studentPhone"
                      placeholder="(11) 99999-9999"
                      className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="studentMeetingPoint">Ponto de Encontro</Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="studentMeetingPoint"
                      placeholder="Centro, Residência..."
                      className={errors.meetingPoint ? "border-red-500 focus-visible:ring-red-500" : ""}
                      {...register("meetingPoint")}
                    />
                  </div>
                  {errors.meetingPoint && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                      {errors.meetingPoint.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="studentEmail">E-mail</Label>
                <div className="mt-1">
                  <Input
                    type="email"
                    id="studentEmail"
                    placeholder="aluno@email.com"
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={addStudentMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-xs transition-transform active:scale-98 cursor-pointer mt-2"
              >
                {addStudentMutation.isPending ? "Cadastrando..." : "Cadastrar Aluno"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
