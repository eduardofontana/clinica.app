import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatTime } from "@/lib/utils"

export interface TodayAppointment {
  id: string
  start_at: string
  end_at: string
  status: string
  patient: { name: string } | null
  professional: { name: string } | null
  service: { name: string } | null
}

export interface TodayAppointmentsProps {
  appointments: TodayAppointment[]
}

function TodayAppointments({ appointments }: TodayAppointmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda de hoje</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState
            icon={<Calendar className="size-8 text-muted-foreground" />}
            title="Nenhuma consulta hoje"
            description="Não há agendamentos para hoje."
          />
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center rounded-md border bg-muted px-2 py-1 text-center min-w-[60px]">
                    <span className="text-xs font-bold text-foreground">
                      {formatTime(appointment.start_at)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(appointment.end_at)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {appointment.patient?.name ?? "Paciente"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.professional?.name ?? "Profissional"}
                      {appointment.service?.name && (
                        <> &middot; {appointment.service.name}</>
                      )}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  type="appointment"
                  status={appointment.status}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {appointments.length > 0 && (
        <CardFooter>
          <Link href="/app/agenda" className="w-full">
            <Button variant="ghost" size="sm" className="w-full">
              Ver agenda completa
              <ArrowRight className="size-3" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

export { TodayAppointments }
