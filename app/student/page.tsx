"use client";

import { useApp } from "@/lib/context";
import Link from "next/link";
import { useState } from "react";
import { formatCentsToBRL } from "@/lib/utils";

export default function StudentDashboard() {
  const { students, classes, payPendingPayment } = useApp();
  const [showPixModal, setShowPixModal] = useState(false);

  // Hardcode Mariana Costa Silva since it's the current logged in student
  const student = students.find((s) => s.id === "mariana-costa") || students[0];
  const nextClass = classes.find(
    (c) => c.studentId === student?.id && c.status !== "Concluída" && c.status !== "Cancelada"
  );

  const handlePayPix = () => {
    if (student) {
      payPendingPayment(student.id, student.pendingPayment);
      setShowPixModal(false);
    }
  };

  if (!student) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Welcome Section */}
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Área do Aluno</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5">Olá, {student.name}</h2>
      </div>

      {/* Progress Bento Card */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Seu Progresso Prático</h3>
            <p className="text-xs text-slate-400 mt-0.5">Categoria {student.category}</p>
          </div>
          <div className="text-2xl font-extrabold text-blue-600">{student.progress}%</div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1.5">
            <span>Aulas Realizadas</span>
            <span>{student.completedClasses} de {student.totalClasses} concluídas</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${student.progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Next Class Highlight */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Próxima Aula</h3>
          {nextClass && (
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 border border-blue-100 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Agendada
            </span>
          )}
        </div>

        {nextClass ? (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl min-w-[70px] py-2 border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Junho</span>
                <span className="text-xl font-extrabold text-slate-900 leading-none mt-0.5">
                  {new Date(nextClass.date + "T00:00:00").getDate()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{nextClass.type}</span>
                <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {nextClass.duration}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ponto de Encontro: {nextClass.meetingPoint}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-slate-50" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  CE
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{nextClass.instructorName}</span>
                  <span className="text-[10px] text-slate-400">Instrutor Credenciado</span>
                </div>
              </div>

              <Link
                href={`https://wa.me/5511977651122`}
                target="_blank"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-xs text-slate-400 font-medium">Sem próximas aulas agendadas.</p>
            <Link
              href="/student/agenda"
              className="text-xs text-blue-600 font-bold hover:underline mt-2 block"
            >
              Solicitar agendamento
            </Link>
          </div>
        )}
      </section>

      {/* Pending Items Grid */}
      <section className="grid grid-cols-2 gap-4">
        {/* Payment Alert */}
        {student.pendingPayment > 0 ? (
          <div
            onClick={() => setShowPixModal(true)}
            className="bg-blue-50/20 border border-blue-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col justify-between gap-3 active:scale-95 transition-all cursor-pointer relative"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Fatura Pendente</span>
              <span className="text-base font-extrabold text-blue-600">{formatCentsToBRL(student.pendingPayment)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-3 relative">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Financeiro</span>
              <span className="text-xs font-bold text-slate-500">Nenhuma fatura pendente</span>
            </div>
          </div>
        )}

        {/* Document Status */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">LADV & Documentação</span>
            <span className="text-xs font-bold text-slate-500">Aprovados Detran</span>
          </div>
        </div>
      </section>

      {/* PIX Payment Modal */}
      {showPixModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-center animate-fade-in">
            <button
              onClick={() => setShowPixModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pagamento via PIX</h3>
            <p className="text-xs text-slate-500 mb-6">Escaneie o QR Code abaixo para efetuar o pagamento da fatura.</p>

            <div className="w-44 h-44 bg-slate-50 border border-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-6 relative overflow-hidden">
              {/* Fake QR code representation */}
              <div className="grid grid-cols-4 gap-2 w-32 h-32 opacity-70">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`rounded ${i % 3 === 0 || i % 7 === 0 ? "bg-slate-900" : "bg-transparent"}`} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 font-bold text-xs text-slate-800">
                Fatura Volante Certo
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 mb-1">Valor da fatura</p>
            <p className="text-2xl font-extrabold text-blue-600 mb-6">{formatCentsToBRL(student.pendingPayment)}</p>

            <button
              onClick={handlePayPix}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-lg text-sm transition-transform active:scale-98 cursor-pointer"
            >
              Confirmar Pagamento Realizado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
