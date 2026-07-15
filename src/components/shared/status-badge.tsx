import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all",
  {
    variants: {
      type: {
        appointment: {},
        quote: {},
      },
      status: {
        scheduled: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
        confirmed: "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
        in_progress: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
        completed: "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
        cancelled: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        no_show: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
        draft: "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
        sent: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
        viewed: "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
        approved: "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
        rejected: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        expired: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
      },
    },
    compoundVariants: [
      { type: "appointment", status: "scheduled", className: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300" },
      { type: "appointment", status: "confirmed", className: "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300" },
      { type: "appointment", status: "in_progress", className: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300" },
      { type: "appointment", status: "completed", className: "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400" },
      { type: "appointment", status: "cancelled", className: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" },
      { type: "appointment", status: "no_show", className: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300" },
      { type: "quote", status: "draft", className: "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400" },
      { type: "quote", status: "sent", className: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300" },
      { type: "quote", status: "viewed", className: "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300" },
      { type: "quote", status: "approved", className: "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300" },
      { type: "quote", status: "rejected", className: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" },
      { type: "quote", status: "expired", className: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300" },
    ],
    defaultVariants: {
      type: "appointment",
      status: "scheduled",
    },
  }
)

const STATUS_LABELS: Record<string, Record<string, string>> = {
  appointment: {
    scheduled: "Agendada",
    confirmed: "Confirmada",
    in_progress: "Em Atendimento",
    completed: "Finalizada",
    cancelled: "Cancelada",
    no_show: "Não Compareceu",
  },
  quote: {
    draft: "Rascunho",
    sent: "Enviado",
    viewed: "Visualizado",
    approved: "Aprovado",
    rejected: "Recusado",
    expired: "Expirado",
  },
}

type StatusBadgeVariantStatus = NonNullable<
  VariantProps<typeof statusBadgeVariants>["status"]
>

export interface StatusBadgeProps extends React.ComponentProps<"span"> {
  status: string
  type?: "appointment" | "quote"
}

function StatusBadge({
  className,
  status,
  type = "appointment",
  ...props
}: StatusBadgeProps) {
  const label = STATUS_LABELS[type]?.[status] ?? status

  return (
    <span
      data-slot="status-badge"
      className={cn(
        statusBadgeVariants({
          type,
          status: status as StatusBadgeVariantStatus,
          className,
        })
      )}
      {...props}
    >
      {label}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
