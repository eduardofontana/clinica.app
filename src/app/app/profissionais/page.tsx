import type { Professional } from "@/lib/db/schema"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Stethoscope } from "lucide-react"
import { ToggleProfessionalStatus } from "./toggle-status"
import { NewProfessionalDialog } from "./new-professional-dialog"

export default async function ProfessionalsPage() {
  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    return (
      <EmptyState
        icon={<Stethoscope className="size-8" />}
        title="Nenhuma clínica encontrada"
        description="Você não está associado a nenhuma clínica."
      />
    )
  }

  const supabase = await createClient()

  const { data: professionals, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Falha ao carregar profissionais:", error.message)
    throw new Error("Falha ao carregar profissionais")
  }

  return (
    <div>
      <PageHeader
        title="Profissionais"
        description="Gerencie os profissionais da clínica"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Profissionais" },
        ]}
      >
        <NewProfessionalDialog />
      </PageHeader>

      {professionals && professionals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((professional: Professional) => {
            const initials = professional.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <Card key={professional.id} size="sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg">
                        {professional.photo_url ? (
                          <AvatarImage
                            src={professional.photo_url}
                            alt={professional.name}
                          />
                        ) : null}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{professional.name}</CardTitle>
                        <CardDescription>
                          {professional.specialty ?? "Sem especialidade"}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">CRO</span>
                      <span className="font-medium">
                        {professional.cro ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          professional.active ? "default" : "secondary"
                        }
                      >
                        {professional.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Telefone</span>
                      <span>{professional.phone ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">E-mail</span>
                      <span className="truncate max-w-[180px]">
                        {professional.email ?? "—"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      {professional.active
                        ? "Clique para desativar"
                        : "Clique para ativar"}
                    </span>
                    <ToggleProfessionalStatus
                      professionalId={professional.id}
                      currentActive={professional.active}
                      clinicId={clinicId}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Stethoscope className="size-8" />}
          title="Nenhum profissional cadastrado"
          description="Você ainda não possui profissionais cadastrados. Clique em Novo profissional para adicionar."
        />
      )}
    </div>
  )
}
