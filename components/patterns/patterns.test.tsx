import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ConfirmDialog } from "./confirm-dialog";
import { EmptyState } from "./empty-state";
import { StatusBadge } from "./status-badge";
import { Spinner } from "@/components/ui/spinner";

describe("ConfirmDialog", () => {
  it("chama onConfirm ao clicar em confirmar", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Cancelar aula?"
        confirmLabel="Sim, cancelar"
        cancelLabel="Voltar"
        destructive
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sim, cancelar" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("fecha pelo botão cancelar sem confirmar", () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Excluir veículo?"
        cancelLabel="Voltar"
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe("EmptyState", () => {
  it("mostra título, descrição e ação", () => {
    render(
      <EmptyState
        title="Nenhuma aula agendada"
        description="Quando houver agendamentos, eles aparecem aqui."
        action={<button>Agendar aula</button>}
      />,
    );

    expect(screen.getByText("Nenhuma aula agendada")).toBeInTheDocument();
    expect(screen.getByText(/aparecem aqui/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agendar aula" })).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it.each([
    ["Pendente", "warning"],
    ["Concluída", "success"],
    ["Cancelada", "destructive"],
    ["Recebido", "success"],
  ])("mapeia %s para a variante %s", (status, variant) => {
    const { container } = render(<StatusBadge status={status} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveTextContent(status);
    expect(badge).toHaveAttribute("data-variant", variant);
  });

  it("usa a variante neutra para estados desconhecidos", () => {
    const { container } = render(<StatusBadge status="Qualquer coisa" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });
});

describe("Spinner", () => {
  it("expõe status acessível com rótulo padrão", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Carregando" })).toBeInTheDocument();
  });
});
