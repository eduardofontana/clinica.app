import { Calendar, UserPlus, FileText, CheckCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

function MetricCard({ title, value, description, icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.positive ? "\u2191" : "\u2193"} {trend.value}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export interface DashboardCardsProps {
  todayAppointments: number
  newPatientsThisMonth: number
  pendingQuotes: number
  attendanceRate: number
}

function DashboardCards({
  todayAppointments,
  newPatientsThisMonth,
  pendingQuotes,
  attendanceRate,
}: DashboardCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Consultas hoje"
        value={todayAppointments}
        icon={<Calendar className="size-4" />}
        description="agendamentos para hoje"
      />
      <MetricCard
        title="Novos pacientes"
        value={newPatientsThisMonth}
        icon={<UserPlus className="size-4" />}
        description="este mês"
      />
      <MetricCard
        title="Orçamentos pendentes"
        value={pendingQuotes}
        icon={<FileText className="size-4" />}
        description="aguardando aprovação"
      />
      <MetricCard
        title="Taxa de atendimento"
        value={`${attendanceRate}%`}
        icon={<CheckCircle className="size-4" />}
        trend={{
          value: "dos agendamentos",
          positive: attendanceRate >= 70,
        }}
      />
    </div>
  )
}

export { DashboardCards }
