"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/user";
import { User } from "@/generated";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "@phosphor-icons/react";

export default function InstructorProfile() {
  const [vehicleName, setVehicleName] = useState("Hyundai HB20 1.0 Manual");
  const [plate, setPlate] = useState("BRA-2E20");
  const [km, setKm] = useState("12.450 km");
  const [fuel, setFuel] = useState("75%");
  const [user, setUser] = useState<User | null>(null);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user.id) {
      getCurrentUser({ id: session.user.id }).then((usr) => {
        setUser(usr);
      });
    }
  }, [session]);

  const userName = user?.name || session?.user?.name || "Instrutor";
  const userEmail = user?.email || session?.user?.email || "";
  const userImage = user?.image || session?.user?.image;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Perfil e Veículo</h2>
        <p className="text-slate-500 text-sm">Gerencie suas informações profissionais e dados do automóvel.</p>
      </div>

      {/* Instructor Information */}
      <section className="bg-white p-6 rounded-sm border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="w-20 h-20 border-2 border-blue-600/20">
          {userImage && <AvatarImage src={userImage} alt={userName} />}
          <AvatarFallback className="bg-slate-100 text-slate-550 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-slate-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900">{userName}</h3>
          <p className="text-xs text-blue-600 font-semibold mt-0.5">Instrutor Credenciado Detran • Credencial #94827-C</p>
          
          <div className="grid grid-cols-2 gap-3 mt-4 text-left max-w-md">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">E-mail</span>
              <span className="text-xs font-bold text-slate-700 block truncate">{userEmail}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Categorias Habilitadas</span>
              <span className="text-xs font-bold text-slate-700">A, B, C, D</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle details */}
      <section className="bg-white p-6 rounded-sm border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Veículo de Instrução</h3>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Vistoria Ativa
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleName" className="text-[10px] uppercase">Modelo do Carro</Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id="vehicleName"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="plate" className="text-[10px] uppercase">Placa Mercosul</Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="km" className="text-[10px] uppercase">Quilometragem</Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id="km"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="fuel" className="text-[10px] uppercase">Nível de Combustível</Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id="fuel"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
