/**
 * Application-wide constants for the Clinica.app dental clinic SaaS.
 */

// ─── Appointment Statuses ───────────────────────────────────────────────────
export const APPOINTMENT_STATUSES = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  in_progress: "Em atendimento",
  completed: "Finalizada",
  cancelled: "Cancelada",
  no_show: "Não compareceu",
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-purple-100 text-purple-800",
};

// ─── Quote Statuses ─────────────────────────────────────────────────────────
export const QUOTE_STATUSES = {
  DRAFT: "draft",
  SENT: "sent",
  VIEWED: "viewed",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

export type QuoteStatus =
  (typeof QUOTE_STATUSES)[keyof typeof QUOTE_STATUSES];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  viewed: "Visualizado",
  approved: "Aprovado",
  rejected: "Recusado",
  expired: "Expirado",
};

// ─── Member Roles ───────────────────────────────────────────────────────────
export const MEMBER_ROLES = {
  ADMIN: "admin",
  DENTIST: "dentist",
  RECEPTIONIST: "receptionist",
} as const;

export type MemberRole = (typeof MEMBER_ROLES)[keyof typeof MEMBER_ROLES];

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  admin: "Administrador",
  dentist: "Dentista",
  receptionist: "Recepcionista",
};

// ─── Treatment Plan Statuses ────────────────────────────────────────────────
export const TREATMENT_PLAN_STATUSES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ON_HOLD: "on_hold",
} as const;

export type TreatmentPlanStatus =
  (typeof TREATMENT_PLAN_STATUSES)[keyof typeof TREATMENT_PLAN_STATUSES];

export const TREATMENT_PLAN_STATUS_LABELS: Record<TreatmentPlanStatus, string> =
  {
    active: "Ativo",
    completed: "Concluído",
    cancelled: "Cancelado",
    on_hold: "Pausado",
  };

// ─── Time Related ───────────────────────────────────────────────────────────
export const DEFAULT_APPOINTMENT_DURATION = 30; // minutes
export const MIN_APPOINTMENT_DURATION = 15;
export const MAX_APPOINTMENT_DURATION = 240;

// ─── Pagination ─────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── Public Paths ───────────────────────────────────────────────────────────
export const PUBLIC_CLINIC_PATH = "/c";
export const PUBLIC_QUOTE_PATH = "/orcamento";
export const PUBLIC_PATIENT_PORTAL_PATH = "/paciente";

// ─── App Routes ─────────────────────────────────────────────────────────────
export const APP_ROUTES = {
  DASHBOARD: "/app/dashboard",
  APPOINTMENTS: "/app/agenda",
  PATIENTS: "/app/pacientes",
  PROFESSIONALS: "/app/profissionais",
  SERVICES: "/app/servicos",
  QUOTES: "/app/orcamentos",
  SETTINGS: "/app/configuracoes",
} as const;
