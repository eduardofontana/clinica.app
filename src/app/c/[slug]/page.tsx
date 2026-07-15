import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data: clinics } = await supabase.from("clinics").select("slug");
  return (clinics ?? []).map((c) => ({ slug: c.slug }));
}

// -- Helpers --------------------------------------------------------------
function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

// -- Page -----------------------------------------------------------------
export default async function ClinicPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch clinic
  const { data: clinic, error: clinicError } = await supabase
    .from("clinics")
    .select("id, name, slug, description, logo_url, banner_url, address, phone, whatsapp_number, email")
    .eq("slug", slug)
    .single();

  if (clinicError || !clinic) {
    notFound();
  }

  // Fetch active services and professionals in parallel
  const [{ data: services }, { data: professionals }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, description, duration_minutes, base_price, category")
      .eq("clinic_id", clinic.id)
      .eq("active", true)
      .order("name"),
    supabase
      .from("professionals")
      .select("id, name, specialty, photo_url, bio")
      .eq("clinic_id", clinic.id)
      .eq("active", true)
      .order("name"),
  ]);

  const workingHours = [
    { day: "Segunda a Sexta", hours: "08:00 — 18:00" },
    { day: "Sábado", hours: "08:00 — 12:00" },
    { day: "Domingo", hours: "Fechado" },
  ];

  const whatsappNumber = clinic.whatsapp_number || clinic.phone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ----- Banner ----- */}
      {clinic.banner_url ? (
        <div
          className="h-48 sm:h-64 lg:h-80 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${clinic.banner_url})` }}
        />
      ) : (
        <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-primary/10 to-primary/5" />
      )}

      {/* ----- Header ----- */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="-mt-12 sm:-mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-8">
          {/* Logo */}
          <div className="size-24 sm:size-32 rounded-xl border bg-card overflow-hidden ring-4 ring-background shrink-0 flex items-center justify-center">
            {clinic.logo_url ? (
              <img
                src={clinic.logo_url}
                alt={clinic.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                {clinic.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {clinic.name}
            </h1>
            {clinic.description && (
              <p className="mt-1 text-muted-foreground max-w-2xl">
                {clinic.description}
              </p>
            )}
          </div>
        </div>

        {/* ----- CTA + Info Grid ----- */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] mb-12">
          {/* Main content */}
          <div className="space-y-12">
            {/* Services */}
            {services && services.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Serviços</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium">{service.name}</h3>
                        {service.base_price !== null && (
                          <span className="text-sm font-semibold text-primary whitespace-nowrap">
                            {formatPrice(service.base_price)}
                          </span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>{formatDuration(service.duration_minutes)}</span>
                        {service.category && (
                          <>
                            <span className="text-border">|</span>
                            <Badge variant="secondary" className="text-xs">
                              {service.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Professionals */}
            {professionals && professionals.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Profissionais</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {professionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="rounded-lg border bg-card p-4 text-center"
                    >
                      <div className="mx-auto mb-3 size-20 rounded-full bg-muted overflow-hidden">
                        {professional.photo_url ? (
                          <img
                            src={professional.photo_url}
                            alt={professional.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                            {professional.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium">{professional.name}</h3>
                      {professional.specialty && (
                        <p className="text-sm text-muted-foreground">
                          {professional.specialty}
                        </p>
                      )}
                      {professional.bio && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {professional.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* CTA */}
            <Link href={`/c/${slug}/agendar`}>
              <Button size="lg" className="w-full text-base">
                Agendar consulta
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>

            {/* WhatsApp */}
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-2.5 text-sm font-medium whitespace-nowrap h-9 gap-1.5 transition-all w-full text-base"
              >
                <Phone className="mr-2 size-4" />
                Falar no WhatsApp
              </a>
            )}

            {/* Address */}
            {clinic.address && (
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                  <span>{clinic.address}</span>
                </div>
              </div>
            )}

            {/* Working Hours */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                Horários
              </h3>
              <div className="space-y-1.5">
                {workingHours.map((wh) => (
                  <div
                    key={wh.day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{wh.day}</span>
                    <span>{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----- Footer ----- */}
      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {clinic.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
