import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookingFlow } from "@/components/booking-flow";
import { ArrowLeft } from "lucide-react";

// -- Page -----------------------------------------------------------------
export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch clinic
  const { data: clinic, error: clinicError } = await supabase
    .from("clinics")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (clinicError || !clinic) {
    notFound();
  }

  // Fetch active services
  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, duration_minutes, base_price")
    .eq("clinic_id", clinic.id)
    .eq("active", true)
    .order("name");

  // Fetch active professionals
  const { data: professionals } = await supabase
    .from("professionals")
    .select("id, name, specialty, photo_url")
    .eq("clinic_id", clinic.id)
    .eq("active", true)
    .order("name");

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {clinic.name}
          </h1>
          <p className="text-muted-foreground mb-8">
            No momento não há serviços disponíveis para agendamento online.
            Entre em contato com a clínica para mais informações.
          </p>
          <Link
            href={`/c/${slug}`}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            Voltar para a página da clínica
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href={`/c/${slug}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium">{clinic.name}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Agendar consulta
          </h1>
          <p className="text-muted-foreground mt-1">
            Preencha as informações abaixo para agendar sua consulta na{" "}
            {clinic.name}.
          </p>
        </div>

        <BookingFlow
          clinicSlug={slug}
          clinicId={clinic.id}
          services={services}
          professionals={professionals || []}
        />
      </main>
    </div>
  );
}
