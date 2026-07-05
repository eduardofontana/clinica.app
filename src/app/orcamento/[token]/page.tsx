import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, CheckCircle, Clock, ArrowLeft } from "lucide-react";

// -- Types ----------------------------------------------------------------
type Quote = {
  id: string;
  clinic_id: string;
  patient_id: string;
  professional_id: string | null;
  title: string;
  description: string | null;
  total_amount: number;
  payment_terms: string | null;
  status: string;
  public_token: string;
  expires_at: string | null;
  approved_at: string | null;
  created_at: string;
};

type QuoteItem = {
  id: string;
  quote_id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Clinic = {
  name: string;
  logo_url: string | null;
  whatsapp_number: string | null;
  phone: string | null;
};

type Patient = {
  name: string;
  phone: string | null;
};

type Professional = {
  name: string;
  specialty: string | null;
};

// -- Helpers --------------------------------------------------------------
function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

const statusConfig: Record<
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

// -- Page -----------------------------------------------------------------
export default async function QuotePublicPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("id, clinic_id, patient_id, professional_id, title, description, total_amount, payment_terms, status, public_token, expires_at, approved_at, created_at")
    .eq("public_token", token)
    .single();

  if (quoteError || !quote) {
    notFound();
  }

  // Fetch quote items
  const { data: items } = await supabase
    .from("quote_items")
    .select("id, quote_id, name, description, quantity, unit_price, total_price")
    .eq("quote_id", quote.id)
    .order("id");

  // Fetch clinic
  const { data: clinic } = await supabase
    .from("clinics")
    .select("name, logo_url, whatsapp_number, phone")
    .eq("id", quote.clinic_id)
    .single();

  // Fetch patient
  const { data: patient } = await supabase
    .from("patients")
    .select("name, phone")
    .eq("id", quote.patient_id)
    .single();

  // Fetch professional
  let professional: Professional | null = null;
  if (quote.professional_id) {
    const { data: prof } = await supabase
      .from("professionals")
      .select("name, specialty")
      .eq("id", quote.professional_id)
      .single();
    professional = prof;
  }

  const statusInfo = statusConfig[quote.status] || {
    label: quote.status,
    variant: "secondary" as const,
  };

  const whatsappLink = clinic?.whatsapp_number || clinic?.phone;
  const whatsappUrl = whatsappLink
    ? `https://wa.me/${whatsappLink.replace(/\D/g, "")}`
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Clinica.app
        </Link>

        {/* Card */}
        <div className="rounded-xl border bg-card overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b bg-muted/20">
            <div className="flex items-center gap-4 mb-4">
              {clinic?.logo_url ? (
                <img
                  src={clinic.logo_url}
                  alt={clinic.name}
                  className="size-12 rounded-lg object-cover"
                />
              ) : (
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {clinic?.name?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <h2 className="font-semibold">{clinic?.name || "Clínica"}</h2>
                <p className="text-xs text-muted-foreground">
                  Orçamento • {formatDate(quote.created_at)}
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {quote.title}
            </h1>
            {quote.description && (
              <p className="mt-2 text-muted-foreground">{quote.description}</p>
            )}
          </div>

          {/* Patient & Professional Info */}
          <div className="p-6 sm:p-8 border-b">
            <div className="grid gap-4 sm:grid-cols-2">
              {patient && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Paciente
                  </p>
                  <p className="font-medium">{patient.name}</p>
                  {patient.phone && (
                    <p className="text-sm text-muted-foreground">
                      {patient.phone}
                    </p>
                  )}
                </div>
              )}
              {professional && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Profissional responsável
                  </p>
                  <p className="font-medium">{professional.name}</p>
                  {professional.specialty && (
                    <p className="text-sm text-muted-foreground">
                      {professional.specialty}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          {items && items.length > 0 && (
            <div className="p-6 sm:p-8 border-b">
              <h3 className="text-sm font-semibold mb-4">
                Itens do orçamento
              </h3>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">
                          {formatPrice(item.total_price)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {item.quantity}x {formatPrice(item.unit_price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="p-6 sm:p-8 border-b bg-muted/10">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Valor total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(quote.total_amount)}
              </span>
            </div>
            {quote.payment_terms && (
              <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" />
                <span>{quote.payment_terms}</span>
              </div>
            )}
            {quote.expires_at && (
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3.5" />
                Válido até {formatDate(quote.expires_at)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 sm:p-8 space-y-3">
            {quote.status !== "aprovado" && quote.status !== "recusado" && (
              <form
                action={async () => {
                  "use server";
                  const supabase = await createClient();

                  // Re-verify the token inside the action to prevent IDOR
                  const { data: freshQuote } = await supabase
                    .from("quotes")
                    .select("id, status, public_token")
                    .eq("public_token", token)
                    .single();

                  if (
                    !freshQuote ||
                    freshQuote.public_token !== token ||
                    freshQuote.status === "aprovado" ||
                    freshQuote.status === "recusado"
                  ) {
                    return;
                  }

                  await supabase
                    .from("quotes")
                    .update({
                      status: "aprovado",
                      approved_at: new Date().toISOString(),
                    })
                    .eq("id", freshQuote.id);
                }}
              >
                <Button type="submit" size="lg" className="w-full text-base">
                  <CheckCircle className="mr-2 size-5" />
                  Aprovar Orçamento
                </Button>
              </form>
            )}
            {whatsappUrl && (
              <Button
                variant="outline"
                size="lg"
                
                className="w-full text-base"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="mr-2 size-4" />
                  Falar com a clínica
                </a>
              </Button>
            )}
            {quote.status === "aprovado" && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <CheckCircle className="size-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-medium text-primary">
                  Orçamento aprovado em {formatDate(quote.approved_at)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Este orçamento foi gerado por{" "}
          <span className="font-medium">{clinic?.name || "Clinica.app"}</span>{" "}
          através da plataforma Clinica.app.
        </p>
      </main>
    </div>
  );
}
