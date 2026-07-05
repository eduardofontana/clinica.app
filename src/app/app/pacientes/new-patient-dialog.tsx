"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

function NewPatientDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)

      const name = formData.get("name") as string
      const phone = formData.get("phone") as string
      const email = formData.get("email") as string
      const document = formData.get("document") as string
      const birth_date = formData.get("birth_date") as string
      const notes = formData.get("notes") as string

      if (!name?.trim()) {
        toast.error("O nome do paciente é obrigatório.")
        return
      }

      startTransition(async () => {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          toast.error("Você precisa estar autenticado.")
          return
        }

        // Get clinic_id from user metadata or clinic_members
        let clinicId = user.app_metadata?.clinic_id as string | undefined

        if (!clinicId) {
          const { data: member } = await supabase
            .from("clinic_members")
            .select("clinic_id")
            .eq("user_id", user.id)
            .maybeSingle()

          clinicId = member?.clinic_id
        }

        if (!clinicId) {
          toast.error("Nenhuma clínica encontrada para o usuário.")
          return
        }

        const { error } = await supabase.from("patients").insert({
          clinic_id: clinicId,
          name: name.trim(),
          phone: phone || null,
          email: email || null,
          document: document || null,
          birth_date: birth_date || null,
          notes: notes || null,
        })

        if (error) {
          toast.error(`Erro ao criar paciente: ${error.message}`)
          return
        }

        toast.success("Paciente cadastrado com sucesso!")
        setOpen(false)
        form.reset()
        router.refresh()
      })
    },
    [router],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="default" size="sm" />}>
        <Plus className="size-4" />
        Novo paciente
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha os dados do paciente para cadastrá-lo na clínica.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome completo do paciente"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  type="tel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="paciente@exemplo.com"
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
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Observações sobre o paciente..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { NewPatientDialog }
