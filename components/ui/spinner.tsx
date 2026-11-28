import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { SpinnerIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("motion-safe:animate-spin text-current", {
  variants: {
    size: {
      sm: "size-3",
      default: "size-4",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type SpinnerProps = React.ComponentProps<"span"> &
  VariantProps<typeof spinnerVariants> & {
    label?: string
  }

/**
 * Indicador de carregamento. Usa o ícone do Phosphor e gira somente quando
 * o usuário não pediu movimento reduzido (motion-safe).
 */
function Spinner({ className, size, label = "Carregando", ...props }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex" {...props}>
      <SpinnerIcon aria-hidden className={cn(spinnerVariants({ size }), className)} />
    </span>
  )
}

export { Spinner }
