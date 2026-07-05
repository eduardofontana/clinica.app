"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar, FileText, User, ClipboardList } from "lucide-react"

import type { Patient, Appointment, Quote } from "@/lib/db/schema"
import { formatDate, formatDateTime, formatPhone, formatCPF, formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

interface PatientTabsProps {
  patient: Patient
  appointments: (Appointment & {
    professional: { name: string; specialty: string | null }
    service: { name: string } | null
  })[]
  quotes: (Quote & {
    professional: { name: string } | null
  })[]
}

function PatientTabs({ patient, appointments, quotes }: PatientTabsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState("dados-gerais")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="dados-gerais">
          <User className="size-4" />
          Dados Gerais
        </TabsTrigger>
        <TabsTrigger value="consultas">
          <Calendar className="size-4" />
          Consultas
        </TabsTrigger>
        <TabsTrigger value="orcamentos">
          <FileText className="size-4" />
          Orçamentos
        </TabsTrigger>
      </TabsList>

      <Separator className="my-4" />

      {/* ─── Dados Gerais Tab ─────────────────────────────────────── */}
      <TabsContent value="dados-gerais">
        <PatientInfoForm patient={patient} />
      </TabsContent>

      {/* ─── Consultas Tab ────────────────────────────────────────── */}
      <TabsContent value="consultas">
        {appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>
                    {formatDateTime(appt.start_at)}
                  </TableCell>
                  <TableCell>
                    {appt.professional?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {appt.service?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      type="appointment"
                      status={appt.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Calendar className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nenhuma consulta encontrada para este paciente.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* ─── Orçamentos Tab ───────────────────────────────────────── */}
      <TabsContent value="orcamentos">
        {quotes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    {quote.title}
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
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nenhum orçamento encontrado para este paciente.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}

/* ─── Patient Info Edit Form ───────────────────────────────────── */
function PatientInfoForm({ patient }: { patient: Patient }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)

      startTransition(async () => {
        const supabase = createClient()

        const { error } = await supabase
          .from("patients")
          .update({
            name: (formData.get("name") as string)?.trim(),
            phone: (formData.get("phone") as string) || null,
            email: (formData.get("email") as string) || null,
            document: (formData.get("document") as string) || null,
            birth_date: (formData.get("birth_date") as string) || null,
            notes: (formData.get("notes") as string) || null,
          })
          .eq("id", patient.id)

        if (error) {
          toast.error(`Erro ao atualizar paciente: ${error.message}`)
          return
        }

        toast.success("Dados do paciente atualizados com sucesso!")
        router.refresh()
      })
    },
    [patient.id, router],
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={patient.name}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={patient.phone ?? ""}
              type="tel"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              defaultValue={patient.email ?? ""}
              type="email"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="document">CPF</Label>
            <Input
              id="document"
              name="document"
              defaultValue={patient.document ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              defaultValue={patient.birth_date ?? ""}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={patient.notes ?? ""}
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  )
}

export { PatientTabs }
