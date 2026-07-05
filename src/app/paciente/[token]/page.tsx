import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarDays, FileText, Phone, Clock, User } from "lucide-react";

// -- Helpers --------------------------------------------------------------
function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatTime(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const quoteStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  rascunho: { label: "Rascunho", variant: "secondary" },
  enviado: { label: "Enviado", variant: "outline" },
  visualizado: { label: "Visualizado", variant: "outline" },
  aprovado: { label: "Aprovado", variant: "default" },
  recusado: { label: "Recusado", variant: "destructive" },
  expirado: { label: "Expirado", variant: "destructive" },
};

const appointmentStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  agendada: { label: "Agendada", variant: "outline" },
  confirmada: { label: "Confirmada", variant: "default" },
  em_atendimento: { label: "Em atendimento", variant: "default" },
  finalizada: { label: "Finalizada", variant: "secondary" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  nao_compareceu: { label: "Não compareceu", variant: "destructive" },
};

// -- Page -----------------------------------------------------------------
export default async function PatientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch portal token record
  const { data: portalToken, error: tokenError } = await supabase
    .from("patient_portal_tokens")
    .select("patient_id, clinic_id, expires_at")
    .eq("token", token)
    .single();

  if (tokenError || !portalToken) {
    notFound();
  }

  // Check expiration
  if (
    portalToken.expires_at &&
    new Date(portalToken.expires_at) < new Date()
  ) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Clock className="size-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Link expirado</h1>
          <p className="text-muted-foreground mb-6">
            Este link de acesso ao portal do paciente expirou. Solicite um novo
            link à sua clínica.
          </p>
        </div>
      </div>
    );
  }

  // Fetch patient
  const { data: patient } = await supabase
    .from("patients")
    .select("id, clinic_id, name, phone, email")
    .eq("id", portalToken.patient_id)
    .single();

  if (!patient) {
    notFound();
  }

  // Fetch clinic
  const { data: clinic } = await supabase
    .from("clinics")
    .select("name, phone, whatsapp_number")
    .eq("id", portalToken.clinic_id)
    .single();

  // Fetch next appointment (future, not cancelled)
  const now = new Date().toISOString();
  const { data: nextAppointment } = await supabase
    .from("appointments")
    .select(
      "id, start_at, end_at, status, services:service_id(name), professionals:professional_id(name)"
    )
    .eq("patient_id", patient.id)
    .eq("clinic_id", portalToken.clinic_id)
    .gte("start_at", now)
    .not("status", "eq", "cancelada")
    .order("start_at", { ascending: true })
    .limit(1)
    .single();

  // Fetch recent quotes
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, title, total_amount, status, public_token, created_at")
    .eq("patient_id", patient.id)
    .eq("clinic_id", portalToken.clinic_id)
    .order("created_at", { ascending: false })
    .limit(5);

  const whatsappLink = clinic?.whatsapp_number || clinic?.phone;
  const whatsappUrl = whatsappLink
    ? `https://wa.me/${whatsappLink.replace(/\D/g, "")}`
    : null;

  // Compute appointment data
  let nextAppt = null;
  if (nextAppointment) {
    const svc = Array.isArray(nextAppointment.services)
      ? nextAppointment.services[0]
      : (nextAppointment.services as unknown as { name: string } | null);
    const prof = Array.isArray(nextAppointment.professionals)
      ? nextAppointment.professionals[0]
      : (nextAppointment.professionals as unknown as { name: string } | null);

    nextAppt = {
      id: nextAppointment.id,
      start_at: nextAppointment.start_at,
      end_at: nextAppointment.end_at,
      status: nextAppointment.status,
      service_name: svc?.name || null,
      professional_name: prof?.name || null,
    };
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Olá, {patient.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao seu portal de paciente da{" "}
            <span className="font-medium text-foreground">
              {clinic?.name || "clínica"}
            </span>
            .
          </p>
        </div>

        <div className="space-y-6">
          {/* Next Appointment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                Próxima consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppt ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {nextAppt.service_name || "Consulta"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(nextAppt.start_at)} às{" "}
                        {formatTime(nextAppt.start_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointmentStatusConfig[nextAppt.status]?.variant ||
                        "outline"
                      }
                    >
                      {appointmentStatusConfig[nextAppt.status]?.label ||
                        nextAppt.status}
                    </Badge>
                  </div>
                  {nextAppt.professional_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="size-3.5" />
                      <span>{nextAppt.professional_name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDays className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma consulta agendada
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                Orçamentos
              </CardTitle>
              <CardDescription>
                {quotes && quotes.length > 0
                  ? `Você tem ${quotes.length} orçamento${
                      quotes.length > 1 ? "s" : ""
                    }`
                  : "Nenhum orçamento disponível"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quotes && quotes.length > 0 ? (
                <div className="space-y-3">
                  {quotes.map((quote) => {
                    const qs =
                      quoteStatusConfig[quote.status] || {
                        label: quote.status,
                        variant: "secondary" as const,
                      };
                    return (
                      <div
                        key={quote.id}
                        className="flex items-center justify-between gap-2 rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {quote.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(quote.created_at)} •{" "}
                            {formatPrice(quote.total_amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={qs.variant}>{qs.label}</Badge>
                          {quote.public_token && quote.status !== "aprovado" && (
                            <Link href={`/orcamento/${quote.public_token}`}>
                              <Button size="xs" variant="outline">
                                Ver
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum orçamento recebido
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            {clinic && (
              <Link
                href={`/c/${clinic.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/agendar`}
              >
                <Button variant="outline" size="lg" className="w-full">
                  <CalendarDays className="mr-2 size-4" />
                  Agendar nova consulta
                </Button>
              </Link>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap h-9 gap-1.5 transition-all hover:bg-muted w-full"
              >
                <Phone className="mr-2 size-4" />
                Falar com a clínica
              </a>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          <p>
            Portal do paciente • {clinic?.name || "Clinica.app"} • &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
