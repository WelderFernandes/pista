"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkle, 
  ArrowRight, 
  CheckCircle, 
  SteeringWheel, 
  CalendarCheck, 
  ShieldCheck, 
  Users, 
  Clock, 
  Question, 
  Chat,
  Coins,
  MapPin,
  CaretDown
} from "@phosphor-icons/react";

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const stats = [
    { value: "+15.000", label: "Aulas Concluídas", desc: "Aulas práticas realizadas com sucesso em nossa plataforma." },
    { value: "99.2%", label: "Taxa de Aprovação", desc: "Alunos aprovados de primeira no exame do DETRAN." },
    { value: "4.95 / 5", label: "Avaliação Média", desc: "Nota atribuída pelos alunos aos nossos instrutores parceiros." },
    { value: "+50", label: "Bairros Atendidos", desc: "Ampla cobertura na grande São Paulo e Campinas." }
  ];

  const steps = [
    {
      num: "01",
      title: "Escolha o Instrutor Ideal",
      desc: "Navegue por nossa lista de instrutores certificados, filtre por preço, distância, categoria de habilitação e veja a opinião de outros alunos."
    },
    {
      num: "02",
      title: "Selecione a Data e Horário",
      desc: "Visualize a agenda do instrutor em tempo real. Escolha os dias e horários que melhor se encaixam na sua rotina diária."
    },
    {
      num: "03",
      title: "Pronto! Inicie as Aulas",
      desc: "O instrutor se desloca até o ponto de encontro combinado. Receba instruções didáticas, controle a sua evolução e conquiste a sua CNH."
    }
  ];

  const features = [
    {
      icon: <CalendarCheck className="w-6 h-6 text-orange-500" />,
      title: "Agendamento Online Dinâmico",
      desc: "Esqueça burocracias de autoescolas. Reserve seus horários diretamente no painel de forma rápida e 100% digital."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
      title: "Instrutores Credenciados e Verificados",
      desc: "Todos os profissionais passam por testes de antecedentes, verificação de credencial do DETRAN e avaliações constantes."
    },
    {
      icon: <Coins className="w-6 h-6 text-orange-500" />,
      title: "Economia e Transparência",
      desc: "Pague diretamente pelas horas de aula contratadas, sem taxas ocultas ou mensalidades surpresa. Excelente custo-benefício."
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Flexibilidade Total de Horários",
      desc: "Aulas no período da manhã, tarde, noite ou aos sábados. Você escolhe o ritmo e quando deseja aprender."
    }
  ];

  const testimonials = [
    {
      name: "Mariana Souza",
      role: "Aprovada na Cat. B",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Tinha muito medo de dirigir e ansiedade. A didática da instrutora Amanda foi maravilhosa, ela teve muita paciência e consegui passar de primeira no exame!"
    },
    {
      name: "Thiago Ramos",
      role: "Aprovado na Cat. A",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Excelente plataforma. Consegui agendar minhas aulas de moto nos meus dias de folga do trabalho e de forma rápida. O instrutor Juliana é nota 10."
    },
    {
      name: "Renato Silveira",
      role: "Aprovado na Cat. D",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Contratei o instrutor Roberto para aulas de ônibus visando concurso público. Didática fantástica e veículo em perfeitas condições. Recomendo muito!"
    }
  ];

  const faqs = [
    {
      question: "Como funciona o ponto de encontro das aulas?",
      answer: "Cada instrutor possui pontos de encontro pré-definidos (como estações de metrô, praças centrais ou em frente a autoescolas parceiras). No momento do agendamento, você seleciona o ponto de encontro que preferir e o instrutor estará lá te esperando com o veículo."
    },
    {
      question: "Posso cancelar ou reagendar uma aula?",
      answer: "Sim! Pelo portal do aluno você pode gerenciar seus horários. Cancelamentos realizados com até 24 horas de antecedência não geram cobranças adicionais e liberam o horário para remarcação."
    },
    {
      question: "Quais são as formas de pagamento disponíveis?",
      answer: "O pagamento é combinado diretamente na plataforma de forma segura, podendo ser feito via PIX, boleto ou cartão de crédito. Você paga o valor hora/aula do instrutor escolhido."
    },
    {
      question: "Os veículos possuem comandos duplos?",
      answer: "Sim. Todos os instrutores parceiros utilizam veículos devidamente equipados com sistema de duplo comando de pedais (freio e embreagem adicionais para o instrutor), além de estarem devidamente segurados e vistoriados."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20">
              V
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">Volante Certo</h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Plataforma de Direção</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="text-orange-500 hover:text-orange-400 transition-colors">Início</Link>
            <Link href="/instrutores" className="hover:text-white transition-colors">Instrutores</Link>
            <Link href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</Link>
            <Link href="#faq" className="hover:text-white transition-colors">Dúvidas</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-semibold px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl bg-slate-900/40 hover:bg-slate-900 transition-all text-slate-200"
            >
              Área Restrita
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 flex flex-col items-center text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkle className="w-4.5 h-4.5" />
            <span>Sua CNH com muito mais tranquilidade</span>
          </span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            Aprenda a Dirigir Sem Medo ou Complicação
          </h2>
          <p className="text-slate-400 mt-6 text-base md:text-xl max-w-2xl leading-relaxed">
            Conectamos você aos melhores instrutores particulares de trânsito. Agende suas aulas 100% online, selecione o ponto de encontro ideal e evolua no seu próprio ritmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center">
            <Link 
              href="/instrutores" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-orange-600/15 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              Encontrar Instrutor
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/login?profile=student" 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Portal do Aluno
            </Link>
            <Link 
              href="/login?profile=instructor" 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Portal do Instrutor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-b border-slate-900 bg-slate-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl flex flex-col gap-2 hover:border-slate-800 transition-colors"
              >
                <span className="text-3xl md:text-4xl font-black text-orange-500">{stat.value}</span>
                <h4 className="font-bold text-sm text-slate-200">{stat.label}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="como-funciona" className="py-24 px-6 max-w-7xl mx-auto w-full z-10 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Como Funciona o Volante Certo?
          </h3>
          <p className="text-slate-400 mt-3 text-sm">
            Em apenas três passos simples você agenda suas aulas práticas e inicia a sua jornada rumo à habilitação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Arrow connectors for desktop */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-orange-500/40 to-blue-500/40 z-0" />
          
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:border-orange-500/20 transition-all hover:bg-slate-900/40"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-500 text-lg group-hover:scale-105 transition-transform">
                {step.num}
              </div>
              <h4 className="font-bold text-lg text-white leading-tight mt-2">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-slate-900 bg-slate-950/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">Nossos diferenciais</span>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Por que escolher nossa plataforma?
            </h3>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Trabalhamos duro para oferecer a melhor experiência de aprendizado, combinando tecnologia inovadora com instrutores de altíssimo nível.
            </p>
            <div className="mt-8">
              <Link 
                href="/instrutores" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                Conheça nossos instrutores agora
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl flex flex-col gap-3 hover:border-slate-700 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850">
                  {feat.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-200 mt-1">{feat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 border-t border-slate-900 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            O que dizem os nossos alunos?
          </h3>
          <p className="text-slate-400 mt-3 text-sm">
            Depoimentos reais de pessoas que transformaram o medo em confiança nas pistas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/10 border border-slate-900/80 p-6 rounded-2xl flex flex-col justify-between gap-6 hover:border-slate-800 transition-colors"
            >
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "{test.quote}"
              </p>
              
              <div className="flex items-center gap-3">
                <img 
                  alt={test.name}
                  src={test.photo}
                  className="w-10 h-10 rounded-full object-cover border border-slate-800"
                />
                <div>
                  <h4 className="font-bold text-xs text-white">{test.name}</h4>
                  <span className="text-[10px] text-orange-500 font-semibold">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-slate-900 px-6 max-w-3xl mx-auto w-full z-10 scroll-mt-20">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Perguntas Frequentes
          </h3>
          <p className="text-slate-400 mt-3 text-sm">
            Ficou com alguma dúvida sobre a plataforma ou o agendamento? Veja as respostas rápidas abaixo.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-sm text-left text-white hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <CaretDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-500" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-850 bg-slate-950/30 text-xs text-slate-400 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full z-10 mb-10">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent pointer-events-none" />
          <h3 className="text-3xl md:text-5xl font-black tracking-tight relative z-10 leading-tight">
            Pronto para dar a sua primeira partida?
          </h3>
          <p className="text-slate-400 mt-4 text-sm md:text-base max-w-xl relative z-10 leading-relaxed">
            Encontre o instrutor perfeito agora e comece a treinar nas ruas com a segurança e a flexibilidade que você merece.
          </p>
          <div className="mt-8 relative z-10">
            <Link 
              href="/instrutores" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-orange-600/25 inline-flex items-center gap-2 transition-transform active:scale-98"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-slate-650 text-[10px] z-10 border-t border-slate-900 bg-slate-950 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-4 sm:gap-0">
        <span className="text-slate-500 font-medium">Volante Certo S.A. &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-6 text-slate-400 font-medium">
          <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Termos de Uso</Link>
          <Link href="/termos" className="hover:text-white transition-colors">Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
