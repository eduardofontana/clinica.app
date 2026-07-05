"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"

interface ToggleProfessionalStatusProps {
  professionalId: string
  currentActive: boolean
}

function ToggleProfessionalStatus({
  professionalId,
  currentActive,
}: ToggleProfessionalStatusProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase
        .from("professionals")
        .update({ active: !currentActive })
        .eq("id", professionalId)

      if (error) {
        toast.error(`Erro ao alterar status: ${error.message}`)
        return
      }

      toast.success(
        currentActive
          ? "Profissional desativado com sucesso."
          : "Profissional ativado com sucesso.",
      )
      router.refresh()
    })
  }

  return (
    <Switch
      checked={currentActive}
      onCheckedChange={handleToggle}
      disabled={isPending}
      size="sm"
    />
  )
}

export { ToggleProfessionalStatus }
