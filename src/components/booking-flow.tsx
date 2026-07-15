"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  User,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";

// -- Types ----------------------------------------------------------------
type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  base_price: number | null;
};

type Professional = {
  id: string;
  name: string;
  specialty: string | null;
  photo_url: string | null;
};

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Generate available time slots (simulated for MVP)
function generateTimeSlots(serviceDuration: number): string[] {
  const slots: string[] = [];
  const startHour = 8;
  const endHour = 18;
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += serviceDuration) {
      const hour = h + Math.floor((h * 60 + m) / 60);
      const minute = (h * 60 + m) % 60;
      if (hour < endHour) {
        slots.push(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      }
    }
  }
  return slots;
}

// Generate next 14 days
function generateDays(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Skip Sundays
    if (date.getDay() !== 0) {
      days.push(date);
    }
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// -- Step Indicators ------------------------------------------------------
const STEPS = [
  { number: 1, label: "Servi\u00E7o" },
  { number: 2, label: "Profissional" },
  { number: 3, label: "Data e Hora" },
  { number: 4, label: "Seus Dados" },
  { number: 5, label: "Confirmar" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex size-8 sm:size-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step.number === current
                  ? "bg-primary text-primary-foreground"
                  : step.number < current
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.number < current ? (
                <Check className="size-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`hidden sm:block text-xs mt-1 ${
                step.number === current
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`hidden sm:block w-8 lg:w-12 h-px ${
                step.number < current ? "bg-primary/30" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// -- Main Component -------------------------------------------------------
export function BookingFlow({
  clinicSlug,
  clinicId,
  services,
  professionals,
}: {
  clinicSlug: string;
  clinicId: string;
  services: Service[];
  professionals: Professional[];
}) {
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Derived data
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || null,
    [services, selectedServiceId]
  );

  const selectedProfessional = useMemo(
    () =>
      professionals.find((p) => p.id === selectedProfessionalId) || null,
    [professionals, selectedProfessionalId]
  );

  const days = useMemo(() => generateDays(), []);
  const timeSlots = useMemo(
    () =>
      selectedService
        ? generateTimeSlots(selectedService.duration_minutes)
        : [],
    [selectedService]
  );

  // Validation
  const canProceedFromStep1 = !!selectedServiceId;
  const canProceedFromStep2 = true; // professional is optional
  const canProceedFromStep3 = !!selectedDate && !!selectedTime;
  const canProceedFromStep4 =
    patientName.trim().length >= 3 && patientPhone.trim().length >= 8;

  // Handlers
  async function handleConfirm() {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setError(null);

    const startAt = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    startAt.setHours(hours, minutes, 0, 0);

    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + selectedService.duration_minutes);

    try {
      // 1. Find or create patient
      let patientId: string;

      const { data: existingPatient } = await supabase
        .from("patients")
        .select("id")
        .eq("clinic_id", clinicId)
        .eq("phone", patientPhone.replace(/\D/g, ""))
        .maybeSingle();

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const { data: newPatient, error: patientError } = await supabase
          .from("patients")
          .insert({
            clinic_id: clinicId,
            name: patientName.trim(),
            phone: patientPhone.replace(/\D/g, ""),
            email: patientEmail.trim() || null,
          })
          .select("id")
          .single();

        if (patientError || !newPatient) {
          throw new Error("Erro ao criar paciente");
        }
        patientId = newPatient.id;
      }

      // 2. Create appointment
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          clinic_id: clinicId,
          patient_id: patientId,
          professional_id: selectedProfessionalId,
          service_id: selectedServiceId,
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
          status: "scheduled",
        });

      if (appointmentError) {
        throw new Error("Erro ao agendar consulta");
      }

      setConfirmed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro ao agendar"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // -- Confirmation screen --
  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="size-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Consulta agendada!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Seu agendamento foi confirmado. A cl\u00EDnica entrar\u00E1 em contato para
          confirmar o hor\u00E1rio.
        </p>
        <div className="rounded-lg border bg-card p-6 mb-8 w-full max-w-sm text-left space-y-3">
          {selectedService && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Servi\u00E7o</span>
              <span className="font-medium">{selectedService.name}</span>
            </div>
          )}
          {selectedProfessional && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profissional</span>
              <span className="font-medium">{selectedProfessional.name}</span>
            </div>
          )}
          {selectedDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Data</span>
              <span className="font-medium">{formatDate(selectedDate)}</span>
            </div>
          )}
          {selectedTime && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hor\u00E1rio</span>
              <span className="font-medium">{selectedTime}h</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paciente</span>
            <span className="font-medium">{patientName}</span>
          </div>
        </div>
        <Button onClick={() => router.push(`/c/${clinicSlug}`)}>
          Voltar para a cl\u00EDnica
        </Button>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ----- Step 1: Select Service ----- */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-1">Escolha o servi\u00E7o</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Selecione o tipo de consulta que deseja agendar.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedServiceId(service.id)}
                className={`text-left rounded-lg border p-4 transition-all hover:border-foreground/20 ${
                  selectedServiceId === service.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium">{service.name}</span>
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
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{formatDuration(service.duration_minutes)}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedFromStep1}
            >
              Pr\u00F3ximo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ----- Step 2: Select Professional ----- */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-1">
            Escolha o profissional
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Selecione o dentista de sua prefer\u00EAncia ou deixe em branco para
            qualquer profissional dispon\u00EDvel.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setSelectedProfessionalId(null)}
              className={`text-center rounded-lg border p-4 transition-all hover:border-foreground/20 ${
                selectedProfessionalId === null
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "bg-card"
              }`}
            >
              <div className="mx-auto mb-2 size-16 rounded-full bg-muted flex items-center justify-center">
                <User className="size-6 text-muted-foreground" />
              </div>
              <span className="font-medium">Qualquer profissional</span>
              <p className="text-xs text-muted-foreground mt-1">
                A cl\u00EDnica definir\u00E1 o melhor profissional
              </p>
            </button>
            {professionals.map((professional) => (
              <button
                key={professional.id}
                type="button"
                onClick={() => setSelectedProfessionalId(professional.id)}
                className={`text-center rounded-lg border p-4 transition-all hover:border-foreground/20 ${
                  selectedProfessionalId === professional.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "bg-card"
                }`}
              >
                <div className="mx-auto mb-2 size-16 rounded-full bg-muted overflow-hidden">
                  {professional.photo_url ? (
                    <img
                      src={professional.photo_url}
                      alt={professional.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {professional.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-medium">{professional.name}</span>
                {professional.specialty && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {professional.specialty}
                  </p>
                )}
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedFromStep2}>
              Pr\u00F3ximo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ----- Step 3: Select Date & Time ----- */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-1">
            Escolha a data e hor\u00E1rio
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Selecione o melhor dia e hor\u00E1rio para sua consulta.
          </p>

          {/* Date selection */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">
              Data dispon\u00EDvel
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((date) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-4 py-3 min-w-[72px] transition-all shrink-0 ${
                    selectedDate && isSameDay(date, selectedDate)
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "bg-card hover:border-foreground/20"
                  }`}
                >
                  <span className="text-xs text-muted-foreground uppercase">
                    {new Intl.DateTimeFormat("pt-BR", {
                      weekday: "short",
                    }).format(date)}
                  </span>
                  <span className="text-lg font-semibold">
                    {date.getDate()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
                      date
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Hor\u00E1rios dispon\u00EDveis para{" "}
                <span className="text-foreground">
                  {formatDate(selectedDate)}
                </span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-lg border px-3 py-2.5 text-sm text-center transition-all ${
                      selectedTime === slot
                        ? "border-primary bg-primary/5 ring-1 ring-primary font-medium"
                        : "bg-card hover:border-foreground/20"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
            <Button onClick={() => setStep(4)} disabled={!canProceedFromStep3}>
              Pr\u00F3ximo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ----- Step 4: Patient Info ----- */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-1">Seus dados</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Informe seus dados para confirmar o agendamento.
          </p>
          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="patient-name"
                className="text-sm font-medium mb-1.5 block"
              >
                Nome completo <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  id="patient-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="patient-phone"
                className="text-sm font-medium mb-1.5 block"
              >
                Telefone <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  id="patient-phone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="patient-email"
                className="text-sm font-medium mb-1.5 block"
              >
                E-mail{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  id="patient-email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(3)}>
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
            <Button onClick={() => setStep(5)} disabled={!canProceedFromStep4}>
              Pr\u00F3ximo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ----- Step 5: Confirmation ----- */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold mb-1">
            Confirmar agendamento
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Revise as informa\u00E7\u00F5es antes de confirmar.
          </p>
          <div className="rounded-lg border bg-card p-6 mb-8 max-w-lg space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Servi\u00E7o</span>
              <span className="font-medium">
                {selectedService?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profissional</span>
              <span className="font-medium">
                {selectedProfessional?.name || "Qualquer profissional"}
              </span>
            </div>
            {selectedService && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dura\u00E7\u00E3o</span>
                <span className="font-medium">
                  {formatDuration(selectedService.duration_minutes)}
                </span>
              </div>
            )}
            {selectedService?.base_price !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">
                  {formatPrice(selectedService?.base_price ?? null)}
                </span>
              </div>
            )}
            <div className="border-t pt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Data</span>
              <span className="font-medium">
                {selectedDate ? formatDate(selectedDate) : "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hor\u00E1rio</span>
              <span className="font-medium">{selectedTime}h</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Paciente</span>
              <span className="font-medium">{patientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Telefone</span>
              <span className="font-medium">{patientPhone}</span>
            </div>
            {patientEmail && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">E-mail</span>
                <span className="font-medium">{patientEmail}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(4)}>
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Agendando...
                </>
              ) : (
                "Confirmar agendamento"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
