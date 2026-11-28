import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Bloco de placeholder para conteúdo em carregamento. Estático de propósito:
 * o escopo de movimento do app é mínimo.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
