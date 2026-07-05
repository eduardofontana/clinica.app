"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId, getUserRole } from "@/lib/auth"
import { canManageClinic } from "@/lib/permissions"

export async function updateClinic(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    throw new Error("Clínica não encontrada.")
  }

  const role = await getUserRole()
  if (!canManageClinic(role)) {
    console.error(
      `[SECURITY] User ${user.id} (role: ${role}) attempted to update clinic ${clinicId} without admin privileges.`,
    )
    throw new Error("Permissão negada. Apenas administradores podem alterar configurações da clínica.")
  }

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  const data: Record<string, string | null> = {}
  if (name?.trim()) data.name = name.trim()
  if (slug?.trim()) data.slug = slug.trim().toLowerCase()
  const document = formData.get("document")
  if (document) data.document = (document as string) || null
  const phone = formData.get("phone")
  if (phone) data.phone = (phone as string) || null
  const email = formData.get("email")
  if (email) data.email = (email as string) || null
  const address = formData.get("address")
  if (address) data.address = (address as string) || null
  const description = formData.get("description")
  if (description) data.description = (description as string) || null
  const whatsapp_number = formData.get("whatsapp_number")
  if (whatsapp_number) data.whatsapp_number = (whatsapp_number as string) || null

  const { error } = await supabase
    .from("clinics")
    .update(data)
    .eq("id", clinicId)

  if (error) {
    console.error(`[DB] Falha ao atualizar clínica ${clinicId}: ${error.message}`)
    throw new Error("Erro ao salvar configurações. Tente novamente.")
  }

  revalidatePath("/app/configuracoes")
  redirect("/app/configuracoes")
}
