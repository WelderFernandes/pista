"use client";

import { useApp } from "@/lib/context";
import { formatCentsToBRL } from "@/lib/utils";

export default function InstructorFinance() {
  const { transactions, students } = useApp();

  const totalInflow = transactions
    .filter((t) => t.type === "payment" && t.status === "Recebido")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingInflow = students.reduce((sum, s) => sum + s.pendingPayment, 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Financeiro Detalhado</h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Controle de faturamento, faturas pendentes e fluxo de caixa</p>
      </div>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Total Recebido */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden h-[160px] hover:scale-[1.01] transition-transform duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100/50">
              Confirmado
            </span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Recebido (Mês)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{formatCentsToBRL(totalInflow)}</p>
          </div>
        </div>

        {/* Faturamento Pendente */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden h-[160px] hover:scale-[1.01] transition-transform duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-100/50">
              A Receber
            </span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">A receber (Alunos)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{formatCentsToBRL(pendingInflow)}</p>
          </div>
        </div>
      </section>

      {/* Visual Analytics Box */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:scale-[1.005] transition-transform duration-200">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 uppercase tracking-wider text-[10px]">Distribuição do Fluxo</h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">Aulas Práticas Avulsas</span>
              <span className="text-slate-800 dark:text-slate-200">70%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: "70%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">Taxas e Simulados</span>
              <span className="text-slate-800 dark:text-slate-200">20%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">Pacotes Completos</span>
              <span className="text-slate-800 dark:text-slate-200">10%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-slate-700 dark:bg-slate-650 rounded-full" style={{ width: "10%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History List */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 uppercase tracking-wider text-[10px]">Histórico de Transações</h3>
        <div className="flex flex-col gap-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-900 hover:border-blue-200 dark:hover:border-blue-900 hover:scale-[1.005] active:scale-[0.995] transition-all duration-200 shadow-xs"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-205">{t.description}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                  {t.studentName} • {new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">{formatCentsToBRL(t.amount)}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-bold mt-1.5 uppercase tracking-wider ${
                  t.status === "Recebido" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/55" : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/55"
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">Nenhuma transação encontrada.</p>
          )}
        </div>
      </section>
    </div>
  );
}
