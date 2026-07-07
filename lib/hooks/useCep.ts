import { useState, useCallback } from "react";
import { fetchAddressByCepAction } from "@/app/actions";

export interface AddressData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export function useCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);

  const lookupCep = useCallback(async (cepInput: string) => {
    const cleanCep = cepInput.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setError("CEP deve conter 8 dígitos.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAddressByCepAction(cleanCep);
      setAddress(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Erro ao buscar o CEP.");
      setAddress(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAddress = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  return { lookupCep, clearAddress, loading, error, address };
}
