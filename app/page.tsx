"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInstructorsFilterStore } from "@/lib/store-instructors";
import { 
  Sparkle, 
  ArrowRight, 
  CalendarCheck, 
  ShieldCheck, 
  Clock, 
  Coins, 
  CaretDown,
  X,
  Check,
  WhatsappLogo,
  User,
  TrendUp,
  EnvelopeSimple,
  MagnifyingGlass,
  MapPin
} from "@phosphor-icons/react";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { setSearchQuery, setSelectedCategory } = useInstructorsFilterStore();

  const [activeMode, setActiveMode] = useState<"student" | "instructor">("student");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Student Search Widget State
  const [searchQueryLocal, setSearchQueryLocal] = useState("");
  const [selectedCategoryLocal, setSelectedCategoryLocal] = useState("TODAS");

  // Modal State for Instructors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Student stats
  const statsStudent = [
    { value: "+15.000", label: "Aulas Concluídas", desc: "Aulas práticas realizadas com sucesso em nossa plataforma." },
    { value: "99.2%", label: "Taxa de Aprovação", desc: "Alunos aprovados de primeira no exame do DETRAN." },
    { value: "4.95 / 5", label: "Avaliação Média", desc: "Nota atribuída pelos alunos aos nossos instrutores parceiros." },
    { value: "+50", label: "Bairros Atendidos", desc: "Ampla cobertura na grande São Paulo e Campinas." }
  ];

  // Instructor stats
  const statsInstructor = [
    { value: "+18.000", label: "Aulas Gerenciadas", desc: "Aulas agendadas e gerenciadas sem planilhas ou burocracia." },
    { value: "85%", label: "Redução de Faltas", desc: "Graças aos lembretes automáticos enviados via WhatsApp." },
    { value: "+R$ 4.500", label: "Ganhos Médios", desc: "Aumento mensal estimado no faturamento dos instrutores Pro." },
    { value: "99.8%", label: "Uptime da Plataforma", desc: "Agenda online sempre disponível para seus alunos." }
  ];

  const stepsStudent = [
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

  const featuresStudent = [
    {
      icon: <CalendarCheck className="w-6 h-6 text-blue-500" />,
      title: "Agendamento Online Dinâmico",
      desc: "Esqueça burocracias de autoescolas. Reserve seus horários diretamente no painel de forma rápida e 100% digital."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "Instrutores Credenciados",
      desc: "Todos os profissionais passam por testes de antecedentes, verificação de credencial do DETRAN e avaliações constantes."
    },
    {
      icon: <Coins className="w-6 h-6 text-blue-500" />,
      title: "Economia e Transparência",
      desc: "Pague diretamente pelas horas de aula contratadas, sem taxas ocultas ou mensalidades surpresa. Excelente custo-benefício."
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Flexibilidade Total",
      desc: "Aulas no período da manhã, tarde, noite ou aos sábados. Você escolhe o ritmo e quando deseja aprender."
    }
  ];


  const plans = [
    {
      name: "Starter",
      price: "49,90",
      period: "mês",
      desc: "Ideal para instrutores que estão começando a se digitalizar.",
      features: [
        "Até 10 alunos ativos",
        "Agenda online completa",
        "Controle financeiro simplificado",
        "Pontos de encontro flexíveis"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "89,90",
      period: "mês",
      desc: "Para profissionais focados em lotar a agenda e escalar ganhos.",
      features: [
        "Alunos ativos ilimitados",
        "Lembretes automáticos no WhatsApp",
        "Ficha digital de progresso do aluno",
        "Controle financeiro avançado",
        "Suporte prioritário via WhatsApp"
      ],
      popular: true
    },
    {
      name: "Autoescola",
      price: "199,90",
      period: "mês",
      desc: "Para quem gerencia múltiplos instrutores e frotas.",
      features: [
        "Até 5 instrutores integrados",
        "Painel centralizado de administração",
        "Relatórios de faturamento de equipe",
        "Gestão de veículos/frota",
        "Treinamento de equipe incluso"
      ],
      popular: false
    }
  ];

  const testimonialsStudent = [
    {
      name: "Mariana Souza",
      role: "Aprovada na Cat. B (São Paulo)",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Tinha muito medo de dirigir e ansiedade. A didática da instrutora Amanda foi maravilhosa, ela teve muita paciência e consegui passar de primeira no exame!"
    },
    {
      name: "Thiago Ramos",
      role: "Aprovado na Cat. A (Campinas)",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Excelente plataforma. Consegui agendar minhas aulas de moto nos meus dias de folga do trabalho e de forma rápida. O instrutor Juliana é nota 10."
    },
    {
      name: "Renato Silveira",
      role: "Aprovado na Cat. D (Guarulhos)",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Contratei o instrutor Roberto para aulas de ônibus visando concurso público. Didática fantástica e veículo em perfeitas condições. Recomendo muito!"
    }
  ];

  const testimonialsInstructor = [
    {
      name: "Julio César",
      role: "Instrutor Particular Cat. B (São Paulo)",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Com a Pista eu saí do papel. Meus alunos agora agendam sozinhos pelas redes sociais. Minhas aulas semanais saltaram de 12 para 38 sem estresse!"
    },
    {
      name: "Amanda Costa",
      role: "Instrutora Credenciada DETRAN (Campinas)",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "O maior ganho foi financeiro. Com os lembretes automáticos de cobrança no WhatsApp, reduzi as faltas e as pendências de pagamento a praticamente zero."
    },
    {
      name: "Roberto Almeida",
      role: "Diretor da Autoescola Aliança (Guarulhos)",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
      quote: "Consolidei a agenda de 4 instrutores em um único painel. A equipe economiza horas de atendimento e os alunos adoram a facilidade de agendamento."
    }
  ];

  const faqsStudent = [
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

  const faqsInstructor = [
    {
      question: "Preciso cadastrar cartão de crédito para fazer o teste grátis?",
      answer: "Não! O teste de 7 dias é totalmente gratuito e livre de compromissos. Você só insere dados de pagamento se decidir continuar utilizando a Pista após o período experimental."
    },
    {
      question: "Como os meus alunos agendam as aulas?",
      answer: "Você recebe um link exclusivo (ex: pista.com/seu-nome). Seus alunos acessam esse link pelo celular, escolhem o dia, horário e ponto de encontro disponíveis e a aula cai direto na sua agenda. Você recebe um aviso instantâneo."
    },
    {
      question: "Consigo enviar mensagens personalizadas no WhatsApp do meu aluno?",
      answer: "Sim! A Pista automatiza os avisos de aula e cobranças amigáveis, enviando diretamente para o WhatsApp do aluno com os detalhes da aula e chave PIX para acerto, economizando seu tempo de digitação."
    },
    {
      question: "E se eu gerenciar mais de uma categoria de habilitação (Ex: Moto e Carro)?",
      answer: "Sem problemas. Você pode configurar em seu perfil quais categorias leciona (A, B, C, D, E) e os valores de hora/aula correspondentes para cada uma delas."
    }
  ];

  // Student Search Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchQueryLocal);
    setSelectedCategory(selectedCategoryLocal);
    router.push("/instrutores");
  };

  // Open Lead Modal and set plan
  const openLeadModal = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
    setIsSuccess(false);
  };

  // Phone masking
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.substring(0, 11);
    
    let formatted = "";
    if (val.length > 0) {
      formatted += `(${val.substring(0, 2)}`;
    }
    if (val.length > 2) {
      formatted += `) ${val.substring(2, 7)}`;
    }
    if (val.length > 7) {
      formatted += `-${val.substring(7, 11)}`;
    }
    setFormData({ ...formData, phone: formatted });
  };

  // Form submission simulation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    
    // Simulate API request to capture lead
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Simulate redirection to register screen after 2.5 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "" });
        window.location.href = `/login?profile=instructor&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`;
      }, 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col justify-between relative overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* Dynamic Grid Background with Vibrant Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a12_1px,transparent_1px),linear-gradient(to_bottom,#0f172a12_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Glow colors shift according to mode */}
      <div className={`absolute top-[-10%] left-[-15%] w-[80%] h-[60%] rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow transition-all duration-500 ${
        activeMode === "student" ? "bg-blue-600/10 dark:bg-blue-600/20" : "bg-rose-500/10 dark:bg-rose-500/20"
      }`} />
      <div className={`absolute bottom-[20%] right-[-10%] w-[60%] h-[70%] rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow transition-all duration-500 ${
        activeMode === "student" ? "bg-rose-500/5 dark:bg-rose-500/10" : "bg-blue-600/10 dark:bg-blue-600/15"
      }`} />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-6 flex flex-col items-center text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Dual Mode Switcher Button - Dynamic sliding toggle */}
          <div className="flex p-1 bg-slate-200/80 dark:bg-slate-900 border border-slate-350/20 dark:border-slate-800 rounded-sm mb-10 relative max-w-md w-full mx-auto shadow-inner">
            <button
              onClick={() => {
                setActiveMode("student");
                setOpenFaqIndex(null);
              }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-sm transition-all duration-300 cursor-pointer ${
                activeMode === "student"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-250"
              }`}
            >
              🎓 Encontrar Instrutor
            </button>
            <button
              onClick={() => {
                setActiveMode("instructor");
                setOpenFaqIndex(null);
              }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-sm transition-all duration-300 cursor-pointer ${
                activeMode === "instructor"
                  ? "bg-rose-500 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-250"
              }`}
            >
              🚗 Sou Instrutor (SaaS)
            </button>
          </div>

          {/* Eyebrow - Conditional rendering */}
          {activeMode === "student" ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest mb-6 animate-float">
              <Sparkle className="w-4 h-4" />
              <span>Sua CNH com muito mais tranquilidade</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-rose-500/10 text-rose-500 dark:text-rose-455 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest mb-6 animate-float">
              <Sparkle className="w-4 h-4" />
              <span>TESTE GRÁTIS POR 7 DIAS — SEM CARTÃO</span>
            </span>
          )}

          {/* Headline - Max 2 lines */}
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] text-slate-900 dark:text-white uppercase max-w-3xl animate-fade-in-up">
            {activeMode === "student" ? (
              <>
                Aprenda a dirigir <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-rose-500">SEM MEDO OU COMPLICAÇÃO.</span>
              </>
            ) : (
              <>
                SUA AGENDA CHEIA. <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-rose-500">SUAS FINANÇAS SOB CONTROLE.</span>
              </>
            )}
          </h2>

          {/* Subtext - Max 20 words */}
          <p className="text-slate-600 dark:text-slate-400 mt-6 text-sm md:text-base max-w-xl leading-relaxed animate-fade-in-up delay-100 font-medium">
            {activeMode === "student" 
              ? "Conectamos você aos melhores instrutores particulares credenciados. Agende online, selecione o ponto de encontro e aprenda no seu ritmo."
              : "A plataforma completa de gestão de aulas e agendamento autônomo feita sob medida para instrutores particulares de trânsito."
            }
          </p>

          {/* Interactive Widgets according to Mode */}
          {activeMode === "student" ? (
            /* Student Search and Filter Widget */
            <form 
              onSubmit={handleSearch} 
              className="mt-10 w-full max-w-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-sm shadow-xl flex flex-col md:flex-row gap-4 text-left relative z-20 animate-fade-in-up delay-200"
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="search-city" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Bairro ou Cidade
                </label>
                <input
                  id="search-city"
                  type="text"
                  placeholder="Ex: Tucuruvi, São Paulo"
                  value={searchQueryLocal}
                  onChange={(e) => setSearchQueryLocal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs py-3 px-3 focus:border-blue-600 focus:outline-hidden transition-colors rounded-sm text-slate-900 dark:text-white placeholder-slate-405"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="search-cat" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 flex items-center gap-1">
                  <Sparkle className="w-3.5 h-3.5 text-rose-500" />
                  Categoria de CNH
                </label>
                <select
                  id="search-cat"
                  value={selectedCategoryLocal}
                  onChange={(e) => setSelectedCategoryLocal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs py-3 px-3 focus:border-blue-600 focus:outline-hidden transition-colors rounded-sm text-slate-900 dark:text-white"
                >
                  <option value="TODAS">Todas as Categorias</option>
                  <option value="A">Moto (Categoria A)</option>
                  <option value="B">Carro (Categoria B)</option>
                  <option value="D">Ônibus (Categoria D)</option>
                </select>
              </div>

              <div className="flex items-end mt-4 md:mt-0">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md shadow-blue-500/10"
                >
                  <MagnifyingGlass className="w-4 h-4" />
                  Buscar Instrutor
                </button>
              </div>
            </form>
          ) : (
            /* Instructor CTA buttons */
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center animate-fade-in-up delay-200 relative z-20">
              <button 
                onClick={() => openLeadModal("Starter")} 
                className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-sm shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Começar Teste Grátis
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="#planos" 
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-sm flex items-center justify-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                Conhecer Planos
              </a>
            </div>
          )}

        </div>

        {/* Dashboard Preview - Rendered only in Instructor mode for B2B SaaS */}
        {activeMode === "instructor" && (
          <div className="max-w-5xl w-full mx-auto mt-16 md:mt-24 relative z-20 animate-fade-in-up delay-300 px-2 md:px-0">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-sm shadow-2xl p-3 md:p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-blue-500 to-rose-500" />
              
              {/* Mock Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-slate-400 font-mono ml-2 uppercase font-bold tracking-wider">PISTA // INSTRUTOR_DASHBOARD</span>
                </div>
                <div className="h-5 w-32 bg-slate-100 dark:bg-slate-850 rounded-sm" />
              </div>

              {/* Mock Stats */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 my-4 md:my-6 text-left">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Faturamento Semanal</span>
                  <span className="text-sm md:text-xl font-black text-slate-900 dark:text-white font-mono">R$ 1.840,00</span>
                  <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5"><TrendUp className="w-3 h-3" /> +15.2% vs ontem</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Aulas Confirmadas</span>
                  <span className="text-sm md:text-xl font-black text-slate-900 dark:text-white font-mono">24 Aulas</span>
                  <span className="text-[9px] text-blue-500 font-bold mt-0.5 block">100% de ocupação</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Novos Alunos</span>
                  <span className="text-sm md:text-xl font-black text-slate-900 dark:text-white font-mono">+6 Alunos</span>
                  <span className="text-[9px] text-rose-500 font-bold mt-0.5 block">2 aguardando ficha</span>
                </div>
              </div>

              {/* Calendar & Agenda Mock Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                
                {/* Active Agenda */}
                <div className="md:col-span-2 p-4 border border-slate-200 dark:border-slate-800 rounded-sm">
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-250 mb-3 tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-blue-600 inline-block" />
                    Agenda de Hoje (Segunda-Feira)
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 bg-blue-500/5 border-l-4 border-blue-600 rounded-sm flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">08:00 - Mariana Souza (Cat. B)</p>
                        <p className="text-[10px] text-slate-555 dark:text-slate-440">Ponto: Estação Metrô Tucuruvi</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold text-[9px] uppercase tracking-wider rounded-sm">Confirmada</span>
                    </div>
                    
                    <div className="p-2.5 bg-rose-500/5 border-l-4 border-rose-500 rounded-sm flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">10:00 - Thiago Ramos (Cat. A)</p>
                        <p className="text-[10px] text-slate-555 dark:text-slate-440">Ponto: Praça Central de Campinas</p>
                      </div>
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 dark:text-rose-455 font-bold text-[9px] uppercase tracking-wider rounded-sm">Confirmar WhatsApp?</span>
                    </div>

                    <div className="p-2.5 bg-slate-500/5 border-l-4 border-slate-400 rounded-sm flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-500 dark:text-slate-400">14:00 - Renato Silveira (Cat. D)</p>
                        <p className="text-[10px] text-slate-555 dark:text-slate-500">Ponto: Centro de Treinamento</p>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-555 dark:text-slate-400 font-bold text-[9px] uppercase tracking-wider rounded-sm">Finalizada</span>
                    </div>
                  </div>
                </div>

                {/* Student progress tracker */}
                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-250 mb-3 tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-3 bg-rose-500 inline-block" />
                      Ficha Digital Ativa
                    </h4>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center font-bold text-xs">
                        MS
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Mariana Souza</p>
                        <p className="text-[9px] text-slate-555 dark:text-slate-455 font-medium">Exame previsto: 18/07</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Aulas Concluídas</span>
                        <span>14 de 20 (70%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-sm overflow-hidden">
                        <div className="bg-blue-600 h-full w-[70%]" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Última avaliação de treino</span>
                    <p className="text-[10px] leading-tight text-slate-655 dark:text-slate-400 italic font-medium">&ldquo;Excelente controle de embreagem em aclive. Precisa revisar baliza na próxima aula.&rdquo;</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-955/60 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(activeMode === "student" ? statsStudent : statsInstructor).map((stat, idx) => (
              <div 
                key={idx} 
                className={`bg-slate-50 dark:bg-slate-900/30 border-2 border-slate-100 dark:border-slate-900 p-6 rounded-sm flex flex-col gap-2 hover:-translate-y-1 transition-all duration-300 group ${
                  activeMode === "student" ? "hover:border-blue-600/30" : "hover:border-rose-500/30"
                }`}
              >
                <span className={`text-3xl md:text-5xl font-black font-mono group-hover:scale-105 transition-transform duration-300 inline-block origin-left ${
                  activeMode === "student" ? "text-blue-600 dark:text-blue-500" : "text-rose-500 dark:text-rose-455"
                }`}>{stat.value}</span>
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">{stat.label}</h4>
                <p className="text-xs text-slate-555 dark:text-slate-500 leading-relaxed font-medium">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How it Works (Student) or Key Features (Instructor) */}
      {activeMode === "student" ? (
        /* How it works for student */
        <section id="como-funciona" className="py-24 px-6 max-w-7xl mx-auto w-full z-10 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h3 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tighter">
              Como Funciona o Volante Certo?
            </h3>
            <p className="text-slate-555 dark:text-slate-400 mt-4 text-sm font-medium">
              Em apenas três passos simples você agenda suas aulas práticas e inicia a sua jornada rumo à habilitação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-linear-to-r from-blue-600/20 to-rose-500/20 dark:from-blue-600/40 dark:to-rose-500/40 z-0" />
            
            {stepsStudent.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white border-2 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800 p-8 rounded-sm relative z-10 flex flex-col gap-4 group hover:border-blue-600/35 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 rounded-sm bg-blue-100 border-2 border-blue-200/50 dark:bg-blue-600/10 dark:border-blue-500/20 flex items-center justify-center font-black text-blue-600 dark:text-blue-500 text-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-350">
                  {step.num}
                </div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase leading-tight mt-2">{step.title}</h4>
                <p className="text-xs text-slate-555 dark:text-slate-450 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* SaaS Features for Instructor */
        <section id="funcionalidades" className="py-24 px-6 max-w-7xl mx-auto w-full z-10 scroll-mt-20 animate-fade-in">
          <div className="max-w-2xl mb-16 text-left">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
              TUDO QUE VOCÊ PRECISA PARA GERENCIAR SUA AUTOESCOLA OU AULAS PARTICULARES
            </h3>
            <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm max-w-xl font-medium leading-relaxed">
              Elimine as conversas infinitas no WhatsApp e organize seu financeiro com recursos pensados especificamente para a rotina do instrutor de trânsito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900 text-white p-8 border-2 border-blue-600 rounded-sm flex flex-col justify-between gap-8 relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px] pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-sm bg-blue-600 flex items-center justify-center text-white border-2 border-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h4 className="font-black text-xl md:text-2xl uppercase tracking-tight text-white mb-3">Link de Agendamento Autônomo</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-medium">
                  Você configura seus dias de trabalho, horários disponíveis e pontos de encontro. O aluno acessa seu link exclusivo, escolhe o melhor horário e agenda a aula em menos de 1 minuto. O agendamento é bloqueado automaticamente em sua agenda para evitar conflitos de horário.
                </p>
              </div>
              <div>
                <button 
                  onClick={() => openLeadModal("Pro")}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-rose-400 hover:text-rose-300 transition-colors group cursor-pointer"
                >
                  Ativar agenda online hoje
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 rounded-sm flex flex-col justify-between gap-6 hover:border-rose-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-sm bg-rose-500/10 dark:bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/20 mb-6">
                  <WhatsappLogo className="w-6 h-6" />
                </div>
                <h4 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white mb-2 leading-tight">Cobrança e Lembretes Automáticos</h4>
                <p className="text-xs text-slate-555 dark:text-slate-450 leading-relaxed font-medium">
                  Reduza as faltas e calotes. O sistema envia notificações automáticas no WhatsApp do aluno 24h antes da aula e disponibiliza o código PIX para acerto.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Reduza até 85% de faltas</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 rounded-sm flex flex-col justify-between gap-6 hover:border-blue-600/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-sm bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-500 border border-blue-500/20 mb-6">
                  <Coins className="w-6 h-6" />
                </div>
                <h4 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white mb-2 leading-tight">Gestão de Ganhos Sem Complicação</h4>
                <p className="text-xs text-slate-555 dark:text-slate-450 leading-relaxed font-medium">
                  Saiba exatamente quanto você ganha por semana e quem está te devendo. Controle pacotes fechados, aulas avulsas e seus custos operacionais como combustível.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Visão financeira em tempo real</span>
            </div>

            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-800 p-8 rounded-sm flex flex-col justify-between gap-8 group">
              <div>
                <div className="w-12 h-12 rounded-sm bg-amber-500/10 dark:bg-amber-500/5 flex items-center justify-center text-amber-505 border border-amber-500/20 mb-6">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="font-black text-xl uppercase tracking-tight text-slate-900 dark:text-white mb-3">Fichas Digitais de Evolução do Aluno</h4>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
                  Substitua as anotações físicas. Registre a evolução do aluno a cada aula prática: avanço nas balizas, controle de aclive, circulação em vias rápidas. Mantenha o aluno motivado exibindo o progresso em percentual (%) direto no painel dele, aumentando a retenção e facilitando a venda de pacotes adicionais.
                </p>
              </div>
              <div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-505 font-bold font-mono text-[9px] uppercase tracking-wider rounded-sm border border-amber-500/20">
                  Padrão DETRAN de Acompanhamento
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Features (Student) or Pricing plans (Instructor) */}
      {activeMode === "student" ? (
        /* Features for students */
        <section className="py-24 border-t border-slate-200 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20 relative z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 text-left">
              <span className="text-xs font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest block mb-3">Nossos diferenciais</span>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">
                Por que escolher nossa plataforma?
              </h3>
              <p className="text-slate-550 dark:text-slate-400 mt-4 text-xs leading-relaxed font-medium">
                Trabalhamos duro para offer uma excelente experiência de aprendizado, conectando você aos melhores profissionais credenciados.
              </p>
              <div className="mt-8">
                <Link 
                  href="/instrutores" 
                  className="inline-flex items-center gap-2 text-xs font-black uppercase text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors group"
                >
                  Conheça nossos instrutores agora
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform animate-pulse" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuresStudent.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border-2 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800 p-6 rounded-sm flex flex-col gap-3 hover:border-blue-600/30 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-sm bg-slate-50 dark:bg-slate-955 flex items-center justify-center border border-slate-200 dark:border-slate-850 group-hover:scale-105 group-hover:border-blue-600/30 transition-all">
                    {feat.icon}
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-850 dark:text-slate-200 mt-1">{feat.title}</h4>
                  <p className="text-xs text-slate-550 dark:text-slate-455 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Pricing plans for instructors */
        <section id="planos" className="py-24 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-955/20 relative z-10 transition-colors duration-300 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                NOSSOS PLANOS DE ASSINATURA
              </h3>
              <p className="text-slate-550 dark:text-slate-400 mt-3 text-sm font-medium">
                Escolha a melhor opção para digitalizar sua agenda. Teste grátis por 7 dias, sem compromisso e sem precisar cadastrar cartão.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
              {plans.map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`bg-slate-50 dark:bg-slate-900/30 p-8 rounded-sm flex flex-col justify-between transition-all duration-300 relative ${
                    plan.popular 
                      ? "border-2 border-rose-500 shadow-xl md:-translate-y-2 scale-[1.01]" 
                      : "border-2 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
                      RECOMENDADO
                    </span>
                  )}
                  
                  <div>
                    <h4 className="font-black text-xl uppercase tracking-wider text-slate-900 dark:text-white mb-2">{plan.name}</h4>
                    <p className="text-xs text-slate-550 dark:text-slate-455 mb-6 font-medium leading-snug">{plan.desc}</p>
                    
                    <div className="flex items-baseline gap-1 my-6">
                      <span className="text-xs font-bold text-slate-500">R$</span>
                      <span className="text-4xl md:text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                      <span className="text-xs text-slate-550 font-bold">/{plan.period}</span>
                    </div>
                    
                    <div className="mb-6 p-2 rounded-sm bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 text-[10px] font-bold text-center tracking-wider uppercase">
                      🎁 Experimente Grátis por 7 Dias
                    </div>

                    <ul className="space-y-3.5 border-t border-slate-200 dark:border-slate-800 pt-6">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-355">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button 
                      onClick={() => openLeadModal(plan.name)}
                      className={`w-full py-4 text-center text-xs font-black uppercase tracking-wider rounded-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                        plan.popular 
                          ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20" 
                          : "bg-slate-900 hover:bg-black text-white dark:bg-slate-850 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800"
                      }`}
                    >
                      Começar Teste Grátis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Featured Instructors Highlight (Student Mode only) */}
      {activeMode === "student" && (
        <section className="py-24 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-955/20 relative z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                Aprenda com quem já aprovou centenas de alunos
              </h3>
              <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm font-medium">
                Nossos instrutores parceiros são avaliados de forma transparente. Veja as notas, o valor da hora/aula e o depoimento de outros alunos antes de contratar.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 rounded-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-500 block mb-1">Aulas práticas de Carro, Moto ou Pesados</span>
                <h4 className="text-xl md:text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight">ENCONTRE O PROFISSIONAL MAIS PRÓXIMO</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 max-w-xl font-medium">
                  Selecione seu bairro de ponto de encontro para visualizar instrutores que atendem na sua região. Agende a aula experimental online de forma rápida.
                </p>
              </div>
              <Link 
                href="/instrutores" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shrink-0 text-center shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Ver Todos os Instrutores
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Testimonials (Dynamic according to mode) */}
      <section className="py-24 border-t border-slate-200 dark:border-slate-900 px-6 max-w-7xl mx-auto w-full z-10 transition-colors duration-300">
        <div className="max-w-2xl mb-16 text-left">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            {activeMode === "student" ? "O que dizem os nossos alunos?" : "QUEM USA A PISTA APROVA E RECOMENDA"}
          </h3>
          <p className="text-slate-550 dark:text-slate-400 mt-3 text-sm font-medium">
            {activeMode === "student" 
              ? "Depoimentos reais de pessoas que transformaram o medo em confiança nas pistas."
              : "Veja como instrutores de todo o país profissionalizaram o atendimento e otimizaram seus lucros."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(activeMode === "student" ? testimonialsStudent : testimonialsInstructor).map((test, idx) => (
            <div 
              key={idx} 
              className={`bg-white dark:bg-slate-905 border-2 border-slate-200 dark:border-slate-900 p-6 rounded-sm flex flex-col justify-between gap-6 hover:-translate-y-1 transition-all duration-300 shadow-sm ${
                activeMode === "student" ? "hover:border-blue-600/30" : "hover:border-rose-500/30"
              }`}
            >
              <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed italic font-medium">
                &ldquo;{test.quote}&rdquo;
              </p>
              
              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-850 pt-4">
                <Image 
                  alt={test.name}
                  src={test.photo}
                  width={36}
                  height={36}
                  className={`w-9 h-9 rounded-sm object-cover border-2 ${
                    activeMode === "student" ? "border-blue-500/20" : "border-rose-500/20"
                  }`}
                />
                <div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">{test.name}</h4>
                  <span className={`text-[10px] font-bold block ${
                    activeMode === "student" ? "text-blue-600 dark:text-blue-500" : "text-rose-550"
                  }`}>{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: FAQ (Dynamic according to mode) */}
      <section id="faq" className="py-24 border-t border-slate-200 dark:border-slate-900 px-6 max-w-3xl mx-auto w-full z-10 scroll-mt-20 transition-colors duration-300">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            PERGUNTAS FREQUENTES
          </h3>
          <p className="text-slate-555 dark:text-slate-400 mt-3 text-sm font-medium">
            Ficou com alguma dúvida sobre a plataforma ou o agendamento? Veja as respostas rápidas abaixo.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {(activeMode === "student" ? faqsStudent : faqsInstructor).map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border-2 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800 rounded-sm overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between font-black text-xs uppercase tracking-wider text-left text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <CaretDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-rose-500" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-100 dark:border-slate-855 bg-slate-50/20 dark:bg-slate-955/30 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 8: Final CTA (Dynamic according to mode) */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full z-10 mb-10">
        {activeMode === "student" ? (
          /* Student final CTA */
          <div className="bg-slate-900 border-2 border-blue-600 rounded-sm p-8 md:p-16 text-center relative overflow-hidden flex flex-col items-center shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent pointer-events-none animate-pulse-slow" />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />

            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter relative z-10 leading-none text-white max-w-2xl">
              PRONTO PARA DAR A SUA PRIMEIRA PARTIDA?
            </h3>
            <p className="text-slate-300 mt-4 text-xs md:text-sm max-w-xl relative z-10 leading-relaxed font-medium">
              Encontre o instrutor perfeito agora e comece a treinar nas ruas com a segurança e flexibilidade que você merece.
            </p>
            <div className="mt-8 relative z-10">
              <Link 
                href="/instrutores" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-sm shadow-lg shadow-blue-500/25 inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-500/35 active:scale-[0.97] cursor-pointer"
              >
                Encontrar Meu Instrutor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Instructor final CTA */
          <div className="bg-slate-900 border-2 border-rose-500 rounded-sm p-8 md:p-16 text-center relative overflow-hidden flex flex-col items-center shadow-xl animate-fade-in">
            <div className="absolute inset-0 bg-linear-to-br from-rose-500/20 to-blue-600/10 pointer-events-none animate-pulse-slow" />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-rose-500/30 rounded-full blur-[80px]" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />

            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter relative z-10 leading-none text-white max-w-2xl">
              PARE DE PERDER TEMPO COM PLANILHAS E ÁUDIOS NO WHATSAPP
            </h3>
            <p className="text-slate-300 mt-4 text-xs md:text-sm max-w-xl relative z-10 leading-relaxed font-medium">
              Assuma o controle da sua agenda hoje mesmo. Comece seu teste de 7 dias gratuitos sem cadastrar cartão.
            </p>
            <div className="mt-8 relative z-10">
              <button 
                onClick={() => openLeadModal("Starter")} 
                className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-sm shadow-lg shadow-rose-500/35 inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Começar Teste Grátis Agora
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Lead Capture Modal Component (Instructors) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm w-full max-w-md p-6 relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-rose-500" />
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left mb-6">
                  <span className="text-[9px] bg-blue-600/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 font-black uppercase tracking-wider rounded-sm border border-blue-500/10">
                    Plano Selecionado: {selectedPlan}
                  </span>
                  <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mt-3">
                    Inicie seu Teste de 7 Dias Grátis
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-medium">
                    Preencha os dados abaixo. Nós criaremos o seu ambiente temporário em segundos. Sem cartão!
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="lead-name" className="block text-[10px] font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-455 dark:text-slate-500" />
                      <input
                        id="lead-name"
                        type="text"
                        required
                        placeholder="Ex: Carlos Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-555 focus:border-blue-600 focus:outline-hidden transition-colors rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-[10px] font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1">
                      E-mail Profissional
                    </label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-3.5 w-4 h-4 text-slate-455 dark:text-slate-500" />
                      <input
                        id="lead-email"
                        type="email"
                        required
                        placeholder="carlos@exemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-555 focus:border-blue-600 focus:outline-hidden transition-colors rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-[10px] font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1">
                      WhatsApp (para alertas)
                    </label>
                    <div className="relative">
                      <WhatsappLogo className="absolute left-3 top-3.5 w-4 h-4 text-slate-455 dark:text-slate-500" />
                      <input
                        id="lead-phone"
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-555 focus:border-blue-600 focus:outline-hidden transition-colors rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-650 text-white font-black text-xs uppercase tracking-wider rounded-sm transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Criando sua conta...
                      </>
                    ) : (
                      <>
                        Liberar Meu Acesso Grátis
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3 font-medium">
                    Ao continuar, você concorda com nossos Termos e Política de Privacidade.
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-sm bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 animate-bounce">
                  <Check className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Acesso Liberado!
                </h4>
                <p className="text-xs text-slate-555 dark:text-slate-450 max-w-xs leading-relaxed font-medium">
                  Parabéns, <strong>{formData.name}</strong>! <br />
                  Seu ambiente Pista de teste gratuito foi configurado. Redirecionando você para o painel...
                </p>
                <div className="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden mt-2 relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-emerald-500 w-full animate-pulse-slow origin-left" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-8 text-slate-500 dark:text-slate-650 text-[10px] z-10 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-4 sm:gap-0 transition-colors duration-300">
        <span className="font-bold uppercase tracking-wider">PISTA S.A. &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-6 font-bold uppercase tracking-wider">
          <Link href="/politica-de-privacidade" className="hover:text-blue-600 dark:hover:text-white transition-colors">Termos de Uso</Link>
          <Link href="/termos" className="hover:text-blue-600 dark:hover:text-white transition-colors">Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
