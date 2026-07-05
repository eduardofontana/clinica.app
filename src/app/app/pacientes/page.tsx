import type { Patient } from "@/lib/db/schema"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { formatDate, formatPhone } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Users } from "lucide-react"
import Link from "next/link"
import { NewPatientDialog } from "./new-patient-dialog"

interface PatientsPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function PatientsPage(props: PatientsPageProps) {
  const searchParams = await props.searchParams
  const q = searchParams.q?.trim() ?? ""

  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    return (
      <EmptyState
        icon={<Users className="size-8" />}
        title="Nenhuma clínica encontrada"
        description="Você não está associado a nenhuma clínica."
      />
    )
  }

  const supabase = await createClient()

  let query = supabase
    .from("patients")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })

  if (q) {
    query = query.ilike("name", `%${q}%`)
  }

  const { data: patients, error } = await query

  if (error) {
    throw new Error(`Falha ao carregar pacientes: ${error.message}`)
  }

  return (
    <div>
      <PageHeader
        title="Pacientes"
        description="Gerencie os pacientes da clínica"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Pacientes" },
        ]}
      >
        <NewPatientDialog />
      </PageHeader>

      {/* Search and filters */}
      <form className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome do paciente..."
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Buscar
        </Button>
        {q && (
          <Link href="/app/pacientes">
            <Button variant="ghost" size="sm">Limpar</Button>
          </Link>
        )}
      </form>

      {/* Patients table */}
      {patients && patients.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Data de Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link
                    href={`/app/pacientes/${patient.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {patient.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatPhone(patient.phone)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.email ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(patient.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={<Users className="size-8" />}
          title="Nenhum paciente encontrado"
          description={
            q
              ? `Nenhum paciente com o nome "${q}" foi encontrado.`
              : 'Você ainda não possui pacientes cadastrados. Clique em "Novo paciente" para adicionar.'
          }
        />
      )}
    </div>
  )
}
