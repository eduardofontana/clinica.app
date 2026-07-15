import { notFound } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { formatDate, formatCurrency } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { QuoteActions } from "./quote-actions"

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QuoteDetailPage(props: QuoteDetailPageProps) {
  const { id } = await props.params

  await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch quote with relations
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select(
      `
      *,
      patient:patients(name, phone, email),
      professional:professionals(name, specialty)
    `,
    )
    .eq("id", id)
    .eq("clinic_id", clinicId)
    .single()

  if (quoteError || !quote) {
    notFound()
  }

  // Fetch quote items
  const { data: items } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", id)
    .order("created_at", { ascending: true })

  const publicLink = quote.public_token
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/orcamento/${quote.public_token}`
    : null

  return (
    <div>
      <PageHeader
        title={quote.title}
        description="Detalhes do orçamento"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Orçamentos", href: "/app/orcamentos" },
          { label: quote.title },
        ]}
      >
        <Button variant="outline" size="sm">
          <Link href="/app/orcamentos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── Main content ─────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quote info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{quote.title}</CardTitle>
                  <CardDescription>
                    Criado em {formatDate(quote.created_at)}
                    {quote.expires_at &&
                      ` — Válido até ${formatDate(quote.expires_at)}`}
                  </CardDescription>
                </div>
                <StatusBadge type="quote" status={quote.status} />
              </div>
            </CardHeader>
            <CardContent>
              {quote.description && (
                <div className="mb-4">
                  <h4 className="mb-1 text-sm font-medium">Descrição</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {quote.description}
                  </p>
                </div>
              )}

              {quote.payment_terms && (
                <div className="mb-4">
                  <h4 className="mb-1 text-sm font-medium">
                    Condições de Pagamento
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {quote.payment_terms}
                  </p>
                </div>
              )}

              <Separator className="my-4" />

              {/* Items */}
              <h4 className="mb-3 text-sm font-medium">Itens do Orçamento</h4>
              {items && items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">
                        Valor Unit.
                      </TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum item listado neste orçamento.
                </p>
              )}

              <Separator className="my-4" />

              <div className="flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">
                    Valor Total
                  </span>
                  <div className="font-heading text-2xl font-semibold">
                    {formatCurrency(quote.total_amount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Sidebar ──────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Patient info */}
          <Card size="sm">
            <CardHeader>
              <CardTitle>Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium">{quote.patient?.name ?? "—"}</p>
                {quote.patient?.phone && (
                  <p className="text-muted-foreground">
                    {quote.patient.phone}
                  </p>
                )}
                {quote.patient?.email && (
                  <p className="text-muted-foreground">
                    {quote.patient.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional info */}
          <Card size="sm">
            <CardHeader>
              <CardTitle>Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              {quote.professional ? (
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium">{quote.professional.name}</p>
                  {quote.professional.specialty && (
                    <p className="text-muted-foreground">
                      {quote.professional.specialty}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Não definido</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card size="sm">
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuoteActions
                quoteId={quote.id}
                quoteStatus={quote.status}
                publicLink={publicLink}
                currentToken={quote.public_token}
                clinicId={clinicId}
              />
            </CardContent>
          </Card>

          {/* Timeline / Status history */}
          <Card size="sm">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Criado em</span>
                  <span>{formatDate(quote.created_at)}</span>
                </div>
                {quote.approved_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Aprovado em</span>
                    <span>{formatDate(quote.approved_at)}</span>
                  </div>
                )}
                {quote.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Válido até</span>
                    <span>{formatDate(quote.expires_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
