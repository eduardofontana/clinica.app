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
import { Switch } from "@/components/ui/switch"

function NewServiceDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [active, setActive] = useState(true)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const formData = new FormData(form)

      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const duration = parseInt(formData.get("duration") as string, 10)
      const base_price = parseFloat(formData.get("base_price") as string)
      const category = formData.get("category") as string

      if (!name?.trim()) {
        toast.error("O nome do serviço é obrigatório.")
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

        const { error } = await supabase.from("services").insert({
          clinic_id: clinicId,
          name: name.trim(),
          description: description || null,
          duration_minutes: isNaN(duration) ? null : duration,
          base_price: isNaN(base_price) ? null : base_price,
          category: category || null,
          active,
        })

        if (error) {
          console.error("Erro ao criar serviço:", error.message)
          toast.error("Erro ao criar serviço")
          return
        }

        toast.success("Serviço cadastrado com sucesso!")
        setOpen(false)
        form.reset()
        setActive(true)
        router.refresh()
      })
    },
    [router, active],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="default" size="sm" />}>
        <Plus className="size-4" />
        Novo serviço
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" title="Novo Serviço" description="Cadastre um novo serviço ou procedimento odontológico.">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome do serviço"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrição do serviço..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Ex: Restauração, Limpeza"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min={0}
                  step={5}
                  placeholder="30"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="base_price">Preço Base (R$)</Label>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
                size="sm"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Serviço ativo
              </Label>
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

export { NewServiceDialog }
