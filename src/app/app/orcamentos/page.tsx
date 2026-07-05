import type { Quote } from "@/lib/db/schema"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"

interface QuoteWithRelations extends Quote {
  patient: { name: string }
  professional: { name: string } | null
}

export default async function QuotesPage() {
  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    return (
      <EmptyState
        icon={<FileText className="size-8" />}
        title="Nenhuma clínica encontrada"
        description="Você não está associado a nenhuma clínica."
      />
    )
  }

  const supabase = await createClient()

  const { data: quotes, error } = await supabase
    .from("quotes")
    .select(
      `
      *,
      patient:patients(name),
      professional:professionals(name)
    `,
    )
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Falha ao carregar orçamentos:", error.message)
    throw new Error("Falha ao carregar orçamentos")
  }

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        description="Gerencie os orçamentos enviados aos pacientes"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Orçamentos" },
        ]}
      >
        <Link href="/app/orcamentos/novo">
          <Button variant="default" size="sm">
            <Plus className="size-4" />
            Novo orçamento
          </Button>
        </Link>
      </PageHeader>

      {quotes && quotes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(quotes as QuoteWithRelations[]).map((quote) => (
              <TableRow key={quote.id} className="cursor-pointer">
                <TableCell>
                  <Link
                    href={`/app/orcamentos/${quote.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {quote.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {quote.patient?.name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {quote.professional?.name ?? "—"}
                </TableCell>
                <TableCell>
                  {formatCurrency(quote.total_amount)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(quote.created_at)}
                </TableCell>
                <TableCell>
                  <StatusBadge type="quote" status={quote.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={<FileText className="size-8" />}
          title="Nenhum orçamento encontrado"
          description="Você ainda não possui orçamentos. Clique em Novo orçamento para criar o primeiro."
        />
      )}
    </div>
  )
}
