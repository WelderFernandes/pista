"use client";

import { useApp } from "@/lib/context";

export default function StudentProgress() {
  const { students } = useApp();

  const student = students.find((s) => s.id === "mariana-costa") || students[0];

  const requirements = [
    { id: "req-1", title: "Controle de Embreagem", desc: "Arrancada e controle em aclives sem deixar o motor apagar.", status: "concluded" },
    { id: "req-2", title: "Baliza em 3 Passos", desc: "Estacionamento perfeito em vaga delimitada em até 5 minutos.", status: "concluded" },
    { id: "req-3", title: "Mudança de Marcha Fluida", desc: "Transição suave de 1ª a 4ª marcha e reduções adequadas.", status: "concluded" },
    { id: "req-4", title: "Uso Correto de Retrovisores", desc: "Olhar retrovisores antes de conversões e troca de faixas.", status: "concluded" },
    { id: "req-5", title: "Conversão e Preferencial", desc: "Posicionamento correto na via e respeito às preferenciais.", status: "concluded" },
    { id: "req-6", title: "Simulado Detran", desc: "Percurso completo reproduzindo os critérios da avaliação oficial.", status: "pending" },
  ];

  if (!student) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Meu Progresso Prático</h2>
        <p className="text-slate-500 text-sm">Acompanhe seu avanço e prepare-se para o exame do Detran.</p>
      </div>

      {/* Overview Card */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Total de Horas Práticas</h3>
          <p className="text-xs text-slate-400 mt-0.5">Mínimo obrigatório pelo Detran: 20 Aulas</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-blue-600">{student.completedClasses}</span>
          <span className="text-slate-400 text-xs font-semibold">/ {student.totalClasses} Aulas Concluídas</span>
        </div>
      </section>

      {/* Requirements Checklist */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 mb-4">Competências Avaliadas</h3>
        
        <div className="flex flex-col gap-4">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                req.status === "concluded"
                  ? "bg-slate-50/50 border-slate-100"
                  : "bg-blue-50/10 border-blue-100"
              }`}
            >
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                req.status === "concluded" ? "bg-emerald-500 text-white" : "border-2 border-blue-600 text-blue-600"
              }`}>
                {req.status === "concluded" ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </div>

              <div>
                <h4 className={`text-xs font-bold ${req.status === "concluded" ? "text-slate-800" : "text-blue-900"}`}>
                  {req.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{req.desc}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  req.status === "concluded"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                  {req.status === "concluded" ? "Desenvolvido" : "Em Treinamento"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
