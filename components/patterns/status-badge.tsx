import * as React from "react"

import { Badge } from "@/components/ui/badge"

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"]

/**
 * Mapeamento dos estados de domínio (aula, pagamento) para variantes visuais.
 * Os valores são os mesmos gravados no banco (ver prisma/schema.prisma).
 */
const STATUS_VARIANTS: Record<string, { label: string; variant: BadgeVariant }> = {
  Pendente: { label: "Pendente", variant: "warning" },
  Confirmada: { label: "Confirmada", variant: "info" },
  "Em andamento": { label: "Em andamento", variant: "info" },
  Concluída: { label: "Concluída", variant: "success" },
  Cancelada: { label: "Cancelada", variant: "destructive" },
  Recebido: { label: "Recebido", variant: "success" },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_VARIANTS[status] ?? { label: status, variant: "secondary" as BadgeVariant }
  return (
    <Badge variant={config.variant} className={className} data-status={status}>
      {config.label}
    </Badge>
  )
}
