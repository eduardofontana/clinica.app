import { notFound } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { PageHeader } from "@/components/shared/page-header"
import { PatientTabs } from "./patient-tabs"

interface PatientDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage(props: PatientDetailPageProps) {
  const { id } = await props.params

  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch patient
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("clinic_id", clinicId)
    .single()

  if (patientError || !patient) {
    notFound()
  }

  // Fetch patient appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      professional:professionals!inner(name, specialty),
      service:services!left(name)
    `,
    )
    .eq("patient_id", id)
    .eq("clinic_id", clinicId)
    .order("start_at", { ascending: false })

  // Fetch patient quotes
  const { data: quotes } = await supabase
    .from("quotes")
    .select(
      `
      *,
      professional:professionals!left(name)
    `,
    )
    .eq("patient_id", id)
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })

  return (
    <div>
      <PageHeader
        title={patient.name}
        description="Detalhes do paciente"
        breadcrumbs={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Pacientes", href: "/app/pacientes" },
          { label: patient.name },
        ]}
      />

      <PatientTabs
        patient={patient}
        appointments={appointments ?? []}
        quotes={quotes ?? []}
        clinicId={clinicId}
      />
    </div>
  )
}
