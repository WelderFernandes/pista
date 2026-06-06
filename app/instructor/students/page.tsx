"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import Link from "next/link";

export default function InstructorStudents() {
  const { students, addStudent } = useApp();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("B (Carro)");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("Centro");

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addStudent({
      name,
      category,
      phone,
      email,
      meetingPoint,
      pendingPayment: 0,
    });

    // Reset fields
    setName("");
    setPhone("");
    setEmail("");
    setMeetingPoint("Centro");
    setShowAddModal(false);
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
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
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
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Students List */}
      <section className="flex flex-col gap-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-sm text-slate-400 font-medium">Nenhum aluno encontrado para sua busca.</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/instructor/students/${student.id}`}
              className="bg-white p-4 rounded-xl border border-slate-100 hover:border-orange-200 transition-all flex items-center justify-between gap-4 shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <img
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  src={student.photoUrl}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">
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
                        className="h-full bg-orange-600 rounded-full transition-all"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Adicionar Novo Aluno</h3>

            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do Aluno"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Categoria de CNH</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                >
                  <option value="B (Carro)">B (Carro)</option>
                  <option value="A (Moto)">A (Moto)</option>
                  <option value="AB (Carro e Moto)">AB (Carro e Moto)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Ponto de Encontro</label>
                  <input
                    type="text"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    placeholder="Centro, Residência..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@email.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 bg-slate-50 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl shadow-lg mt-2 text-sm transition-transform active:scale-98 cursor-pointer"
              >
                Cadastrar Aluno
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
