"use client";

import { useApp } from "@/lib/context";
import { useState } from "react";
import { formatCentsToBRL } from "@/lib/utils";

import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "@phosphor-icons/react";

export default function StudentProfile() {
  const { data: session } = useSession();
  const { students, transactions, payPendingPayment } = useApp();
  const [showPixModal, setShowPixModal] = useState(false);

  const student = students.find((s) => s.userId === session?.user?.id) || students.find((s) => s.id === "mariana-costa") || students[0];
  const studentPayments = transactions.filter((t) => student && (t.studentName.includes(student.name.split(" ")[0]) || t.studentName === student.name));

  const handlePayPix = () => {
    if (student) {
      payPendingPayment(student.id, student.pendingPayment);
      setShowPixModal(false);
    }
  };

  if (!student) return null;

  const userImage = session?.user?.image || student.photoUrl;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Meu Perfil</h2>
        <p className="text-slate-500 text-sm">Visualize suas informações pessoais, pagamentos e veículo designado.</p>
      </div>

      {/* Profile Info Card */}
      <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="w-20 h-20 border-2 border-blue-500/20 shadow-md">
          {userImage && <AvatarImage src={userImage} alt={student.name} />}
          <AvatarFallback className="bg-slate-100 text-slate-550 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-slate-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
          <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1.5">
            Categoria {student.categories?.[0] || student.category || 'B'}
          </span>
          
          <div className="grid grid-cols-2 gap-3 mt-4 text-left max-w-sm mx-auto md:mx-0">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Telefone</span>
              <span className="text-xs font-bold text-slate-700">{student.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">E-mail</span>
              <span className="text-xs font-bold text-slate-700 truncate block">{student.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Info Card */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 mb-4">Veículo de Treinamento</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Hyundai HB20 1.0 Manual</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Placa: BRA-2E20 • Cor: Branco</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Vistoria OK
          </span>
        </div>
      </section>

      {/* Payments History & Pending Invoice */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Extrato Financeiro</h3>
          
          {student.pendingPayment > 0 && (
            <button
              onClick={() => setShowPixModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              Pagar Pendência (PIX)
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {student.pendingPayment > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <div>
                <h4 className="text-xs font-bold text-amber-900">Taxa de Aulas Práticas Complementares</h4>
                <p className="text-[10px] text-amber-700 mt-0.5">Vencimento em aberto</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-amber-700">{formatCentsToBRL(student.pendingPayment)}</span>
                <span className="block text-[8px] text-amber-600 font-bold uppercase mt-0.5">Aguardando PIX</span>
              </div>
            </div>
          )}

          {studentPayments.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.description}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-800">{formatCentsToBRL(t.amount)}</span>
                <span className="block text-[8px] text-emerald-600 font-bold uppercase mt-0.5">{t.status}</span>
              </div>
            </div>
          ))}
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
