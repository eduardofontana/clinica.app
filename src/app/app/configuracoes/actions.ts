"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId, getUserRole } from "@/lib/auth"
import { canManageClinic } from "@/lib/permissions"

export async function updateClinic(formData: FormData): Promise<void> {
  const supabase = await createClient()
  await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    throw new Error("Clínica não encontrada.")
  }

  const role = await getUserRole()
  if (!canManageClinic(role)) {
    throw new Error("Permissão negada. Apenas administradores podem alterar configurações da clínica.")
  }

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  const data: Record<string, string | null> = {}
  if (name?.trim()) {
    const trimmed = name.trim()
    if (trimmed.length > 100) throw new Error("Nome muito longo (máximo 100 caracteres).")
    data.name = trimmed
  }
  if (slug?.trim()) {
    const trimmed = slug.trim().toLowerCase()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
      throw new Error("Slug inválido. Use apenas letras minúsculas, números e hífens.")
    }
    if (trimmed.length > 50) throw new Error("Slug muito longo (máximo 50 caracteres).")
    data.slug = trimmed
  }

  const fields = ["document", "phone", "email", "address", "description", "whatsapp_number"] as const
  for (const field of fields) {
    const value = formData.get(field)
    if (value !== null && value !== undefined) {
      const str = (value as string) || null
      if (str && str.length > 500) throw new Error(`Campo ${field} muito longo.`)
      data[field] = str
    }
  }

  const { error } = await supabase
    .from("clinics")
    .update(data)
    .eq("id", clinicId)

  if (error) {
    throw new Error("Erro ao salvar configurações. Tente novamente.")
  }

  revalidatePath("/app/configuracoes")
  redirect("/app/configuracoes")
}
