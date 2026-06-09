"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InstructorProfile() {
  const [vehicleName, setVehicleName] = useState("Hyundai HB20 1.0 Manual");
  const [plate, setPlate] = useState("BRA-2E20");
  const [km, setKm] = useState("12.450 km");
  const [fuel, setFuel] = useState("75%");

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Perfil e Veículo</h2>
        <p className="text-slate-500 text-sm">Gerencie suas informações profissionais e dados do automóvel.</p>
      </div>

      {/* Instructor Information */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Image
          alt="Carlos Eduardo"
          className="w-20 h-20 rounded-full object-cover border-2 border-orange-500/20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYkqb9Ie4QMBVCOXtW103-nVJFRxnfLyYsXAdoW5LjFBVUJ5WvYfPD-WmNFSWCBQ56SHtHrdBMS5JJjbjEOssIm509LQ94Tf1sEyq1AjB6Xs0x7MiU503Y27oCDXn2U3pbzeicE8_NzeD8r9_L12fczcNrM_pDT5JakUXAINc4pvLuhsbRN3QXAjHbq1fAWgcx3wtqF9oPndL948bucCmG-u5xQ6QM6RfqZPlU_yKfVPf4WA9uwowtGrnu8UJs5Asbe3u1jP1DH7k"
          width={80}
          height={80}
          unoptimized
        />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900">Carlos Eduardo de Oliveira</h3>
          <p className="text-xs text-orange-600 font-semibold mt-0.5">Instrutor Credenciado Detran • Credencial #94827-C</p>
          
          <div className="grid grid-cols-2 gap-3 mt-4 text-left max-w-md">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Telefone</span>
              <span className="text-xs font-bold text-slate-700">(11) 97765-1122</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Categorias Habilitadas</span>
              <span className="text-xs font-bold text-slate-700">A, B, C, D</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle details */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
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
