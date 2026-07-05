"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"

export async function updateClinic(formData: FormData): Promise<void> {
  const supabase = await createClient()
  await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    throw new Error("Clínica não encontrada.")
  }

  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    document: (formData.get("document") as string) || null,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    address: (formData.get("address") as string) || null,
    description: (formData.get("description") as string) || null,
    whatsapp_number: (formData.get("whatsapp_number") as string) || null,
  }

  const { error } = await supabase
    .from("clinics")
    .update(data)
    .eq("id", clinicId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/app/configuracoes")
  redirect("/app/configuracoes")
}
