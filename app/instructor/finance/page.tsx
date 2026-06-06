"use client";

import { useApp } from "@/lib/context";

export default function InstructorFinance() {
  const { transactions, students } = useApp();

  const totalInflow = transactions
    .filter((t) => t.type === "payment" && t.status === "Recebido")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingInflow = students.reduce((sum, s) => sum + s.pendingPayment, 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Financeiro Detalhado</h2>
        <p className="text-slate-500 text-sm">Controle de faturamento, faturas pendentes e fluxo de caixa.</p>
      </div>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Recebido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
              Confirmado
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Recebido (Mês)</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">R$ {totalInflow.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        {/* Faturamento Pendente */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
              A Receber
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">A receber (Alunos)</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">R$ {pendingInflow.toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </section>

      {/* Visual Analytics Box */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Distribuição do Fluxo</h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-500">Aulas Práticas Avulsas</span>
              <span className="text-slate-800">70%</span>
            </div>
            <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 rounded-full" style={{ width: "70%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-500">Taxas e Simulados</span>
              <span className="text-slate-800">20%</span>
            </div>
            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-500">Pacotes Completos</span>
              <span className="text-slate-800">10%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-700 rounded-full" style={{ width: "10%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History List */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Histórico de Transações</h3>
        <div className="flex flex-col gap-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.description}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.studentName} • {new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-800">R$ {t.amount.toLocaleString("pt-BR")}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 uppercase ${
                  t.status === "Recebido" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
