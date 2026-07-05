"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

function NewProfessionalDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)

      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const phone = formData.get("phone") as string
      const cro = formData.get("cro") as string
      const specialty = formData.get("specialty") as string
      const bio = formData.get("bio") as string

      if (!name?.trim()) {
        toast.error("O nome do profissional é obrigatório.")
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

        const { error } = await supabase.from("professionals").insert({
          clinic_id: clinicId,
          name: name.trim(),
          email: email || null,
          phone: phone || null,
          cro: cro || null,
          specialty: specialty || null,
          bio: bio || null,
          active: true,
        })

        if (error) {
          console.error("Erro ao criar profissional:", error.message)
          toast.error("Erro ao criar profissional")
          return
        }

        toast.success("Profissional cadastrado com sucesso!")
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
        Novo profissional
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" title="Novo Profissional" description="Cadastre um novo profissional na clínica.">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome completo do profissional"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cro">CRO</Label>
                <Input
                  id="cro"
                  name="cro"
                  placeholder="Número do CRO"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  placeholder="Ex: Ortodontia"
                />
              </div>
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
                  placeholder="profissional@exemplo.com"
                  type="email"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Breve biografia do profissional..."
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

export { NewProfessionalDialog }
