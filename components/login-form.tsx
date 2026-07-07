"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/schemas";
import { Eye, EyeSlash, ArrowRight, ArrowLeft, Check, IdentificationCard, Buildings, Car, Notebook } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { z } from "zod";
import { createInstructorSettingsAction } from "@/app/actions";

type FormData = z.infer<typeof signUpSchema>;

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [profile, setProfile] = useState<"instructor" | "student">("instructor");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Wizard state for instructor signup
  const [signupStep, setSignupStep] = useState(1);

  // Extra guided fields for instructor setup
  const [city, setCity] = useState("São Paulo");
  const [neighborhoodsInput, setNeighborhoodsInput] = useState("Centro, Pinheiros, Jardins");
  const [meetingPointsInput, setMeetingPointsInput] = useState("Metrô Consolação, Shopping Cidade São Paulo");
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(["B"]);
  const [hourlyRateInput, setHourlyRateInput] = useState("120");
  const [bio, setBio] = useState("Instrutor credenciado com ampla experiência no ensino de novos motoristas com paciência e didática.");

  const { register, handleSubmit, reset, trigger, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      orgName: ""
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryProfile = params.get("profile");
      const queryName = params.get("name");
      const queryEmail = params.get("email");

      if (queryProfile === "instructor" || queryProfile === "student") {
        setTimeout(() => {
          setProfile(queryProfile);
        }, 0);
      }

      if (queryName || queryEmail) {
        setTimeout(() => {
          setMode("signup");
          const defaultName = queryName || "";
          const defaultEmail = queryEmail || "";
          const defaultOrgName = queryProfile === "instructor" && defaultName ? `Aulas de ${defaultName}` : "";
          
          reset({
            name: defaultName,
            email: defaultEmail,
            password: "",
            confirmPassword: "",
            orgName: defaultOrgName
          });
        }, 0);
      }
    }
  }, [reset]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();
  };

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: authData, error: authError } = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (authError) {
        throw new Error(authError.message || "E-mail ou senha incorretos.");
      }

      // Busca as organizações do usuário e define a primeira como ativa
      const { data: orgsData } = await authClient.organization.list();
      if (orgsData && orgsData.length > 0) {
        await authClient.organization.setActive({
          organizationId: orgsData[0].id,
        });
      }

      return authData;
    },
    onSuccess: () => {
      setSuccess("Login efetuado com sucesso! Redirecionando...");
      setTimeout(() => {
        if (profile === "instructor") {
          router.push("/instructor");
        } else {
          router.push("/student");
        }
      }, 1200);
    },
    onError: (err: Error) => {
      setError(err.message || "Ocorreu um erro ao tentar efetuar o login.");
    }
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const parsed = signUpSchema.safeParse({
        ...data,
        role: profile,
        orgName: profile === "instructor" ? data.orgName : undefined,
      });

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Dados de cadastro inválidos.");
      }

      const { data: userData, error: signUpError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (signUpError) {
        throw new Error(signUpError.message || "Erro ao criar sua conta.");
      }

      if (profile === "instructor" && data.orgName) {
        const { data: orgData, error: orgError } = await authClient.organization.create({
          name: data.orgName,
          slug: slugify(data.orgName),
        });

        if (orgError) {
          throw new Error(`Conta criada, mas falhou ao registrar a Autoescola: ${orgError.message}`);
        }

        // Call the server action to save all guided setup fields
        await createInstructorSettingsAction(orgData.id, {
          city: city,
          neighborhoods: neighborhoodsInput.split(",").map(n => n.trim()).filter(n => n.length > 0),
          meetingPoints: meetingPointsInput.split(",").map(m => m.trim()).filter(m => m.length > 0),
          hourlyRate: Math.round(Number(hourlyRateInput) * 100),
          categories: categoriesSelected,
          bio: bio,
        });
      }

      return userData;
    },
    onSuccess: () => {
      if (profile === "instructor") {
        setSuccess("Autoescola e conta registradas com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/instructor");
        }, 1500);
      } else {
        setSuccess("Conta de aluno criada com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/student");
        }, 1500);
      }
    },
    onError: (err: Error) => {
      setError(err.message || "Ocorreu um erro no processo de registro.");
    }
  });

  const onSubmit = (data: FormData) => {
    setError("");
    setSuccess("");
    if (mode === "login") {
      loginMutation.mutate(data);
    } else {
      signUpMutation.mutate(data);
    }
  };

  const handleNextStep = async () => {
    if (signupStep === 1) {
      const isValid = await trigger(["name", "email", "password", "confirmPassword"]);
      if (isValid) {
        setSignupStep(2);
      }
    } else if (signupStep === 2) {
      const isValid = await trigger("orgName");
      if (isValid && city.trim().length > 0 && neighborhoodsInput.trim().length > 0) {
        setSignupStep(3);
      }
    } else if (signupStep === 3) {
      if (categoriesSelected.length > 0 && Number(hourlyRateInput) > 0) {
        setSignupStep(4);
      }
    }
  };

  const handlePrevStep = () => {
    if (signupStep > 1) {
      setSignupStep(signupStep - 1);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setCategoriesSelected(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-sm bg-linear-to-tr from-blue-600 to-rose-500 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 text-white group-hover:scale-105 transition-transform duration-300">
            P
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter text-slate-900 dark:text-white">
            Pista
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 py-8 px-6 shadow-2xl rounded-sm sm:px-10 transition-colors duration-300 backdrop-blur-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1.5 font-medium">
              {mode === "login" 
                ? "Digite suas credenciais de acesso abaixo." 
                : (profile === "instructor" 
                    ? "Siga os passos abaixo para registrar seu perfil profissional." 
                    : "Preencha os campos para iniciar sua jornada de aprendizado.")}
            </p>
          </div>

          {/* Profile Tabs Selector - Only visible when not in active wizard signup steps > 1 */}
          {(mode === "login" || (mode === "signup" && (profile === "student" || signupStep === 1))) && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-sm mb-6">
              <button
                type="button"
                onClick={() => setProfile("instructor")}
                className={`py-2 text-xs font-bold rounded-sm transition-all cursor-pointer ${
                  profile === "instructor"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Sou Instrutor
              </button>
              <button
                type="button"
                onClick={() => setProfile("student")}
                className={`py-2 text-xs font-bold rounded-sm transition-all cursor-pointer ${
                  profile === "student"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Sou Aluno
              </button>
            </div>
          )}

          {/* Step indicator header for Instructor Signup */}
          {mode === "signup" && profile === "instructor" && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
                <span className="text-blue-600 dark:text-blue-400">Passo {signupStep} de 4</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {signupStep === 1 ? "Dados de Acesso" : signupStep === 2 ? "Sua Autoescola" : signupStep === 3 ? "Categorias & Preço" : "Seu Perfil"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 1 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
                <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 2 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
                <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 3 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
                <div className={`h-full flex-1 transition-all duration-500 ${signupStep >= 4 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              </div>
              
              {/* Visual mini-indicator steps icons */}
              <div className="flex justify-between items-center mt-4 px-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-sm border transition-all duration-300 ${signupStep === 1 ? "border-blue-600 bg-blue-600/10 text-blue-600" : signupStep > 1 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                  <IdentificationCard className="w-4 h-4" />
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 mx-1" />
                <div className={`flex items-center justify-center w-7 h-7 rounded-sm border transition-all duration-300 ${signupStep === 2 ? "border-blue-600 bg-blue-600/10 text-blue-600" : signupStep > 2 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                  <Buildings className="w-4 h-4" />
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 mx-1" />
                <div className={`flex items-center justify-center w-7 h-7 rounded-sm border transition-all duration-300 ${signupStep === 3 ? "border-blue-600 bg-blue-600/10 text-blue-600" : signupStep > 3 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                  <Car className="w-4 h-4" />
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 mx-1" />
                <div className={`flex items-center justify-center w-7 h-7 rounded-sm border transition-all duration-300 ${signupStep === 4 ? "border-blue-600 bg-blue-600/10 text-blue-600" : "border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                  <Notebook className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-sm mb-4 font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-sm mb-4 font-semibold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* INSTRUCTOR SIGNUP WIZARD - STEP 1 & STUDENT SIGNUP */}
            <div className={(mode === "signup" && profile === "instructor" && signupStep !== 1) ? "hidden" : "flex flex-col gap-4"}>
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="mt-1">
                    <InputGroup className={`rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.name ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-600'}`}>
                      <InputGroupAddon align="inline-start">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="name"
                        placeholder="Ex: Carlos Eduardo Silva"
                        {...register("name")}
                      />
                    </InputGroup>
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="email">
                  {profile === "instructor" ? "E-mail institucional" : "E-mail de acesso"}
                </Label>
                <div className="mt-1">
                  <InputGroup className={`rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.email ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-600'}`}>
                    <InputGroupAddon align="inline-start">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="email"
                      id="email"
                      placeholder={profile === "instructor" ? "nome@suaautoescola.com" : "aluno@provedor.com"}
                      {...register("email")}
                    />
                  </InputGroup>
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha de acesso</Label>
                <div className="mt-1">
                  <InputGroup className={`rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.password ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-600'}`}>
                    <InputGroupAddon align="inline-start">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </InputGroupAddon>
                    <InputGroupInput
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                      >
                        {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {mode === "signup" && (
                <div>
                  <Label htmlFor="confirmPassword">Confirmação de senha</Label>
                  <div className="mt-1">
                    <InputGroup className={`rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.confirmPassword ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-600'}`}>
                      <InputGroupAddon align="inline-start">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </InputGroupAddon>
                      <InputGroupInput
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                        >
                          {showConfirmPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* INSTRUCTOR SIGNUP WIZARD - STEP 2: AUTOESCOLA INFO */}
            {mode === "signup" && profile === "instructor" && (
              <div className={signupStep === 2 ? "flex flex-col gap-4 animate-fade-in" : "hidden"}>
                <div>
                  <Label htmlFor="orgName">Nome da Autoescola (Organização / Tenant)</Label>
                  <div className="mt-1">
                    <InputGroup className={`rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.orgName ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-blue-600'}`}>
                      <InputGroupAddon align="inline-start">
                        <Buildings className="w-4 h-4 text-slate-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="orgName"
                        placeholder="Ex: Autoescola Pista Pinheiros"
                        {...register("orgName")}
                      />
                    </InputGroup>
                  </div>
                  {errors.orgName && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                      {errors.orgName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">Cidade de Atuação</Label>
                  <div className="mt-1">
                    <InputGroup className="rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: São Paulo"
                      />
                    </InputGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="neighborhoods">Bairros Atendidos (Separados por vírgula)</Label>
                  <div className="mt-1">
                    <textarea
                      id="neighborhoods"
                      value={neighborhoodsInput}
                      onChange={(e) => setNeighborhoodsInput(e.target.value)}
                      className="flex w-full rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-20 transition-colors"
                      placeholder="Ex: Pinheiros, Vila Madalena, Butantã"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* INSTRUCTOR SIGNUP WIZARD - STEP 3: CATEGORIES & HOURLY RATE */}
            {mode === "signup" && profile === "instructor" && (
              <div className={signupStep === 3 ? "flex flex-col gap-4 animate-fade-in" : "hidden"}>
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Categorias CNH que você atua</span>
                  <div className="grid grid-cols-5 gap-2">
                    {["A", "B", "C", "D", "E"].map((cat) => {
                      const isSelected = categoriesSelected.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`py-3 rounded-sm font-bold text-xs border text-center transition-all ${
                            isSelected 
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                              : "border-slate-200 bg-slate-50 dark:border-slate-850 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }`}
                        >
                          Cat. {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Valor da Hora/Aula (R$)</Label>
                  <div className="mt-1">
                    <InputGroup className="rounded-sm border bg-slate-50 dark:bg-slate-950 p-1 h-11 border-slate-200 dark:border-slate-800 focus-within:border-blue-600">
                      <InputGroupAddon align="inline-start">
                        <span className="text-xs font-bold text-slate-500 pl-1">R$</span>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        id="hourlyRate"
                        value={hourlyRateInput}
                        onChange={(e) => setHourlyRateInput(e.target.value)}
                        placeholder="Ex: 120"
                        min="1"
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">/ 50 min</span>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pl-1">
                    Esse valor será visível publicamente na listagem para agendamento de alunos.
                  </p>
                </div>
              </div>
            )}

            {/* INSTRUCTOR SIGNUP WIZARD - STEP 4: BIO & MEETING POINTS */}
            {mode === "signup" && profile === "instructor" && (
              <div className={signupStep === 4 ? "flex flex-col gap-4 animate-fade-in" : "hidden"}>
                <div>
                  <Label htmlFor="bio">Biografia Profissional</Label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="flex w-full rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-24 transition-colors leading-relaxed"
                      placeholder="Fale um pouco sobre você, seu carro, sua metodologia e diferenciais..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meetingPoints">Pontos de Encontro Principais (Separados por vírgula)</Label>
                  <div className="mt-1">
                    <textarea
                      id="meetingPoints"
                      value={meetingPointsInput}
                      onChange={(e) => setMeetingPointsInput(e.target.value)}
                      className="flex w-full rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 h-20 transition-colors"
                      placeholder="Ex: Metrô Consolação, Entrada Principal Shopping, Posto Shell Centro"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pl-1">
                    Locais públicos onde você costuma buscar/iniciar a aula com o aluno.
                  </p>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS (SUBMIT & STEP NAVIGATION) */}
            {mode === "login" && (
              <div className="flex justify-between items-center text-xs mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 dark:text-slate-400">
                  <input type="checkbox" className="rounded bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0" />
                  Lembrar de mim
                </label>
                <Link href="/recuperar-senha" className="text-slate-550 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
            )}

            {/* BUTTON BAR */}
            <div className="flex gap-3 mt-4">
              {/* Back button (Only visible in instructor signup wizard steps > 1) */}
              {mode === "signup" && profile === "instructor" && signupStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold p-3.5 rounded-sm text-xs transition-all flex items-center justify-center gap-1.5 h-11 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}

              {/* Next or Submit Button */}
              {mode === "signup" && profile === "instructor" && signupStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-sm shadow-lg shadow-blue-500/20 text-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5 h-11 cursor-pointer"
                >
                  Próximo Passo
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loginMutation.isPending || signUpMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-sm shadow-lg shadow-blue-500/20 text-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5 h-11 cursor-pointer disabled:opacity-50"
                >
                  {loginMutation.isPending || signUpMutation.isPending ? (
                    <span>Aguarde...</span>
                  ) : mode === "login" ? (
                    <>
                      Entrar no Painel
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      {profile === "instructor" ? "Finalizar Cadastro" : "Criar Conta de Aluno"}
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            {mode === "login" ? (
              <>
                {profile === "instructor" ? "Deseja cadastrar sua Autoescola? " : "Ainda não tem conta de aluno? "}
                <button 
                  onClick={() => { setMode("signup"); setSignupStep(1); setError(""); setSuccess(""); reset(); }}
                  className="font-bold text-slate-800 dark:text-white hover:underline cursor-pointer"
                >
                  Registre-se agora
                </button>
              </>
            ) : (
              <>
                Já possui uma conta ativa?{" "}
                <button 
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); reset(); }}
                  className="font-bold text-slate-800 dark:text-white hover:underline cursor-pointer"
                >
                  Faça login aqui
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
