"use client";

import { useState } from "react";
import { submitClassActionRating } from "@/app/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, X } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RatingModalProps {
  classSessionId: string;
  studentName: string;
  classType: string;
  onSuccess?: () => void;
}

export function RatingModal({ classSessionId, studentName, classType, onSuccess }: RatingModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError("Selecione pelo menos 1 estrela.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitClassActionRating({
        classSessionId,
        rating,
        comment: comment || undefined,
      });
      setSuccess(true);
      setSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao enviar avaliação.");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Dialog>
        <DialogContent className="sm:max-w-md text-center py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Obrigado, {studentName}!</DialogTitle>
            <DialogDescription>
              Sua avaliação para a aula <strong>{classType}</strong> foi enviada com sucesso.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mr-2" />
              <span className="text-lg font-black">Avaliada com {rating} estrelas</span>
            </div>
            <Button onClick={() => router.refresh()} className="w-full mt-4">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hidden" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avalie sua aula</DialogTitle>
          <DialogDescription>
            Como foi a aula de <strong>{classType}</strong> com {studentName}?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {stars.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  rating !== null && star <= rating
                    ? "text-amber-500 bg-amber-100 dark:bg-amber-900/20"
                    : "text-slate-300 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <Star className="w-6 h-6 fill-none" />
              </button>
            ))}
          </div>
          {rating && (
            <p className="text-sm font-bold text-center text-slate-600 dark:text-slate-300">
              Você avaliou com {rating} estrela{rating > 1 ? "s" : ""}
            </p>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Deixe seu feedback sobre a aula..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            ></textarea>
          </div>
          {error && (
            <p className="text-sm text-rose-500 dark:text-rose-400 font-medium">{error}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSuccess(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || !rating}
              className="w-full"
            >
              {submitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
