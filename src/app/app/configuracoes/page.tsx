import { unauthorized } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId, getUserRole } from "@/lib/auth"
import { canManageClinic } from "@/lib/permissions"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { MEMBER_ROLE_LABELS } from "@/lib/constants"
import { updateClinic } from "./actions"

export const metadata = {
  title: "Configurações",
}

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  await getUserOrRedirect()
  const clinicId = await getClinicId()

  const role = await getUserRole()
  if (!canManageClinic(role)) {
    unauthorized()
  }

  if (!clinicId) {
    return (
      <div>
        <PageHeader
          title="Configurações"
          description="Você ainda não está vinculado a uma clínica."
        />
        <EmptyState
          title="Nenhuma clínica encontrada"
          description="Entre em contato com o administrador do sistema."
        />
      </div>
    )
  }

  // Fetch clinic data
  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("id", clinicId)
    .single()

  // Fetch clinic members
  const { data: members } = await supabase
    .from("clinic_members")
    .select("id, role, created_at, users!inner(name, email)")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: true })

  if (!clinic) {
    return (
      <div>
        <PageHeader
          title="Configurações"
          description="Clínica não encontrada."
        />
        <EmptyState
          title="Clínica não encontrada"
          description="Os dados da clínica não puderam ser carregados."
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Configurações"
        description="Gerencie as informações da sua clínica"
      />

      {/* ─── Clinic Data Form ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da clínica</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateClinic} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome da clínica</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={clinic.name}
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-muted-foreground">(URL amigável)</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={clinic.slug}
                  required
                />
              </div>

              {/* Document (CNPJ) */}
              <div className="space-y-2">
                <Label htmlFor="document">CNPJ</Label>
                <Input
                  id="document"
                  name="document"
                  defaultValue={clinic.document ?? ""}
                  placeholder="00.000.000/0001-00"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={clinic.phone ?? ""}
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={clinic.email ?? ""}
                  placeholder="contato@clinica.com.br"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  defaultValue={clinic.whatsapp_number ?? ""}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                defaultValue={clinic.address ?? ""}
                placeholder="Rua, número, bairro, cidade - UF"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={clinic.description ?? ""}
                placeholder="Breve descrição da clínica..."
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* ─── Members List ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          {!members || members.length === 0 ? (
            <EmptyState
              title="Nenhum membro encontrado"
              description="Sua clínica ainda não possui membros."
            />
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Membro desde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => {
                    const userData = (member.users as { name: string; email: string }[])?.[0] ?? null
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {userData?.name ?? "Usuário"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {userData?.email ?? "—"}
                        </TableCell>
                        <TableCell>
                          {MEMBER_ROLE_LABELS[member.role as keyof typeof MEMBER_ROLE_LABELS] ?? member.role}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(member.created_at)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
