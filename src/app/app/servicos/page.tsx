import type { Service } from "@/lib/db/schema"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { formatCurrency, formatDuration } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Stethoscope } from "lucide-react"
import { NewServiceDialog } from "./new-service-dialog"

export default async function ServicesPage() {
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

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Falha ao carregar serviços:", error.message)
    throw new Error("Falha ao carregar serviços")
  }

  return (
    <div>
      <PageHeader
        title="Serviços"
        description="Gerencie os serviços e procedimentos oferecidos pela clínica"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Serviços" },
        ]}
      >
        <NewServiceDialog />
      </PageHeader>

      {services && services.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <Card key={service.id} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>
                      {service.category ?? "Sem categoria"}
                    </CardDescription>
                  </div>
                  <Badge variant={service.active ? "default" : "secondary"}>
                    {service.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                  {service.description ?? "Sem descrição"}
                </p>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-medium">
                    {formatDuration(service.duration_minutes)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preço base</span>
                  <span className="font-medium">
                    {formatCurrency(service.base_price)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Stethoscope className="size-8" />}
          title="Nenhum serviço cadastrado"
          description="Você ainda não possui serviços cadastrados. Clique em Novo serviço para adicionar."
        />
      )}
    </div>
  )
}
