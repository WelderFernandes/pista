"use client";

import { use, useState } from "react";
import { useApp } from "@/lib/context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { students, classes, confirmClass, completeClass } = useApp();

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

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-semibold">Aluno não encontrado.</p>
        <Link href="/instructor/students" className="text-orange-600 font-bold hover:underline mt-4 block">
          Voltar para Lista
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{student.name}</h2>
          <p className="text-slate-500 text-sm">Ficha cadastral e progresso prático do aluno.</p>
        </div>
      </div>

      {/* Profile Info Card */}
      <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          alt={student.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/20 shadow-md"
          src={student.photoUrl}
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
            <span className="inline-block bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mx-auto md:mx-0">
              Cat. {student.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">Matrícula realizada em 12 de Outubro de 2023</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 max-w-md mx-auto md:mx-0 text-left">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Telefone</span>
              <span className="text-xs font-bold text-slate-700">{student.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">E-mail</span>
              <span className="text-xs font-bold text-slate-700 truncate block">{student.email}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Ponto de Encontro</span>
              <span className="text-xs font-bold text-slate-700">{student.meetingPoint}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center md:justify-start mt-6">
            <a
              href={`tel:${student.phone}`}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all active:scale-95"
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
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-500/10"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Progresso de Aulas Práticas</h4>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold text-orange-600">{student.progress}%</span>
              <span className="text-xs text-slate-400 font-semibold">
                {student.completedClasses} de {student.totalClasses} Concluídas
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>
          <div className="border-t border-slate-50 mt-6 pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Exame Estimado</span>
            <span className="font-bold text-slate-700">Meados de Junho/2026</span>
          </div>
        </div>

        {/* Financial Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between items-center text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            student.pendingPayment > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
          }`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {student.pendingPayment > 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Status Financeiro</h4>
          
          {student.pendingPayment > 0 ? (
            <>
              <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                Fatura Pendente
              </span>
              <p className="text-xl font-extrabold text-amber-700">R$ {student.pendingPayment.toLocaleString("pt-BR")}</p>
            </>
          ) : (
            <>
              <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                Totalmente Pago
              </span>
              <p className="text-xs text-slate-400">Pacote contratado 100% quitado</p>
            </>
          )}
        </div>
      </div>

      {/* Instructor Notes */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-900 text-sm">Observações do Instrutor</h4>
          <button
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            className="text-xs text-orange-600 font-bold hover:underline"
          >
            {isEditingNotes ? "Pronto" : "Editar"}
          </button>
        </div>

        {isEditingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        ) : (
          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium">
            {notes}
          </p>
        )}
      </section>

      {/* Student Class History */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h4 className="font-bold text-slate-900 text-sm mb-4">Histórico de Aulas</h4>
        {studentClasses.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-4">Nenhuma aula registrada para este aluno.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {studentClasses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{c.type}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(c.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })} • {c.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    c.status === "Confirmada" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                    c.status === "Concluída" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    c.status === "Cancelada" ? "bg-red-50 text-red-700 border border-red-100" :
                    "bg-yellow-50 text-yellow-700 border border-yellow-100"
                  }`}>
                    {c.status}
                  </span>

                  {c.status === "Pendente" && (
                    <button
                      onClick={() => confirmClass(c.id)}
                      className="px-2 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Confirmar
                    </button>
                  )}
                  {c.status === "Confirmada" && (
                    <button
                      onClick={() => completeClass(c.id)}
                      className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
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
