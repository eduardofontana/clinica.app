import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { PageHeader } from "@/components/shared/page-header"
import { QuoteForm } from "./quote-form"

export default async function NewQuotePage() {
  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    throw new Error("Nenhuma clínica encontrada para o usuário.")
  }

  const supabase = await createClient()

  // Fetch patients
  const { data: patients } = await supabase
    .from("patients")
    .select("id, name")
    .eq("clinic_id", clinicId)
    .order("name", { ascending: true })

  // Fetch professionals
  const { data: professionals } = await supabase
    .from("professionals")
    .select("id, name, specialty")
    .eq("clinic_id", clinicId)
    .eq("active", true)
    .order("name", { ascending: true })

  // Fetch services for quote items
  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, duration_minutes, base_price")
    .eq("clinic_id", clinicId)
    .eq("active", true)
    .order("name", { ascending: true })

  return (
    <div>
      <PageHeader
        title="Novo Orçamento"
        description="Crie um orçamento personalizado para o paciente"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Orçamentos", href: "/app/orcamentos" },
          { label: "Novo" },
        ]}
      />

      <QuoteForm
        patients={patients ?? []}
        professionals={professionals ?? []}
        services={services ?? []}
      />
    </div>
  )
}
