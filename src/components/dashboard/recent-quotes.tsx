import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"

export interface RecentQuote {
  id: string
  title: string
  total_amount: number
  status: string
  created_at: string
  patient: { name: string } | null
}

export interface RecentQuotesProps {
  quotes: RecentQuote[]
}

function RecentQuotes({ quotes }: RecentQuotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-8 text-muted-foreground" />}
            title="Nenhum orçamento"
            description="Não há orçamentos recentes."
          />
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {quote.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {quote.patient?.name ?? "Paciente"} &middot;{" "}
                    {formatRelativeTime(quote.created_at)}
                  </p>
                </div>
                <div className="ml-3 flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {formatCurrency(quote.total_amount)}
                  </span>
                  <StatusBadge type="quote" status={quote.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {quotes.length > 0 && (
        <CardFooter>
          <Link href="/app/orcamentos" className="w-full">
            <Button variant="ghost" size="sm" className="w-full">
              Ver todos os orçamentos
              <ArrowRight className="size-3" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

export { RecentQuotes }
