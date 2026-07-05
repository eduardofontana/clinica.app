import Link from "next/link"
import { CalendarPlus } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { formatTime, formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Agenda",
}

const STATUS_FILTERS = [
  { label: "Todas", value: null },
  { label: "Agendadas", value: "scheduled" },
  { label: "Confirmadas", value: "confirmed" },
  { label: "Em Atendimento", value: "in_progress" },
  { label: "Finalizadas", value: "completed" },
  { label: "Canceladas", value: "cancelled" },
] as const

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  await getUserOrRedirect()
  const clinicId = await getClinicId()

  const { status } = await searchParams
  const activeFilter = status ?? null

  let query = supabase
    .from("appointments")
    .select(
      "id, start_at, end_at, status, notes, patients!inner(name), professionals!inner(name), services!left(name)",
    )
    .eq("clinic_id", clinicId)
    .order("start_at", { ascending: true })

  if (activeFilter) {
    query = query.eq("status", activeFilter)
  }

  const { data: appointments, error } = await query

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`)
  }

  const hasAppointments = appointments && appointments.length > 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Gerencie os agendamentos da clínica"
      >
        <Link href="/app/agenda/novo">
          <Button size="sm">
            <CalendarPlus className="size-4" />
            Novo agendamento
          </Button>
        </Link>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value
          const href = filter.value
            ? `/app/agenda?status=${filter.value}`
            : "/app/agenda"

          return (
            <Link key={filter.label} href={href}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
              >
                {filter.label}
              </Button>
            </Link>
          )
        })}
      </div>

      {!hasAppointments ? (
        <EmptyState
          title="Nenhum agendamento encontrado"
          description={
            activeFilter
              ? "Não há agendamentos com esse status."
              : "Não há agendamentos cadastrados."
          }
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment: any) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {formatTime(appointment.start_at)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(appointment.start_at)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {appointment.patients?.name ?? "Paciente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {appointment.professionals?.name ?? "Profissional"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {appointment.services?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      type="appointment"
                      status={appointment.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
