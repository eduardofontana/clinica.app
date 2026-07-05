// ============================================================================
// Clinica.app — Database Schema TypeScript Definitions
// ============================================================================
// These interfaces map directly to the PostgreSQL tables defined in the
// initial migration (supabase/migrations/00001_initial_schema.sql).
//
// Naming conventions:
//   - TableName = interface matching the database table
//   - TableNameInsert = subset used for INSERT operations (nullable fields)
//   - TableNameRow = row type returned from Supabase (all fields required)
// ============================================================================

// ---------------------------------------------------------------------------
// Utility types
// ---------------------------------------------------------------------------

/** Maps to pg_catalog.timestamptz */
type Timestamp = string;

/** Maps to pg_catalog.date */
type DateString = string;

/** Maps to pg_catalog.decimal(10,2) */
type Decimal = number;

/** Maps to pg_catalog.jsonb */
type Json = Record<string, unknown> | null;

// ---------------------------------------------------------------------------
// Enums (checked as TEXT columns in the database — mirrored here as union types)
// ---------------------------------------------------------------------------

export type ClinicMemberRole = 'admin' | 'dentist' | 'receptionist';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'approved'
  | 'rejected'
  | 'expired';

export type TreatmentPlanStatus =
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type TreatmentStepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed';

// ---------------------------------------------------------------------------
// clinics
// ---------------------------------------------------------------------------

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  document: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  whatsapp_number: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ClinicInsert {
  name: string;
  slug: string;
  document?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  whatsapp_number?: string | null;
}

// ---------------------------------------------------------------------------
// users  (public profiles, linked to auth.users)
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserInsert {
  id: string;
  name: string;
  email: string;
}

// ---------------------------------------------------------------------------
// clinic_members
// ---------------------------------------------------------------------------

export interface ClinicMember {
  id: string;
  clinic_id: string;
  user_id: string;
  role: ClinicMemberRole;
  created_at: Timestamp;
}

export interface ClinicMemberInsert {
  clinic_id: string;
  user_id: string;
  role: ClinicMemberRole;
}

// ---------------------------------------------------------------------------
// patients
// ---------------------------------------------------------------------------

export interface Patient {
  id: string;
  clinic_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  document: string | null;
  birth_date: DateString | null;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface PatientInsert {
  clinic_id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  document?: string | null;
  birth_date?: DateString | null;
  notes?: string | null;
}

// ---------------------------------------------------------------------------
// professionals
// ---------------------------------------------------------------------------

export interface Professional {
  id: string;
  clinic_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  cro: string | null;
  specialty: string | null;
  bio: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProfessionalInsert {
  clinic_id: string;
  user_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  cro?: string | null;
  specialty?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  active?: boolean;
}

// ---------------------------------------------------------------------------
// services
// ---------------------------------------------------------------------------

export interface Service {
  id: string;
  clinic_id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  base_price: Decimal | null;
  category: string | null;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ServiceInsert {
  clinic_id: string;
  name: string;
  description?: string | null;
  duration_minutes?: number | null;
  base_price?: Decimal | null;
  category?: string | null;
  active?: boolean;
}

// ---------------------------------------------------------------------------
// appointments
// ---------------------------------------------------------------------------

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  professional_id: string;
  service_id: string | null;
  start_at: Timestamp;
  end_at: Timestamp;
  status: AppointmentStatus;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface AppointmentInsert {
  clinic_id: string;
  patient_id: string;
  professional_id: string;
  service_id?: string | null;
  start_at: Timestamp;
  end_at: Timestamp;
  status?: AppointmentStatus;
  notes?: string | null;
}

// ---------------------------------------------------------------------------
// quotes
// ---------------------------------------------------------------------------

export interface Quote {
  id: string;
  clinic_id: string;
  patient_id: string;
  professional_id: string | null;
  title: string;
  description: string | null;
  total_amount: Decimal;
  payment_terms: string | null;
  status: QuoteStatus;
  public_token: string | null;
  expires_at: Timestamp | null;
  approved_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface QuoteInsert {
  clinic_id: string;
  patient_id: string;
  professional_id?: string | null;
  title: string;
  description?: string | null;
  total_amount?: Decimal;
  payment_terms?: string | null;
  status?: QuoteStatus;
  public_token?: string | null;
  expires_at?: Timestamp | null;
  approved_at?: Timestamp | null;
}

// ---------------------------------------------------------------------------
// quote_items
// ---------------------------------------------------------------------------

export interface QuoteItem {
  id: string;
  quote_id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: Decimal;
  total_price: Decimal;
  created_at: Timestamp;
}

export interface QuoteItemInsert {
  quote_id: string;
  name: string;
  description?: string | null;
  quantity?: number;
  unit_price?: Decimal;
  total_price?: Decimal;
}

// ---------------------------------------------------------------------------
// treatment_plans
// ---------------------------------------------------------------------------

export interface TreatmentPlan {
  id: string;
  clinic_id: string;
  patient_id: string;
  quote_id: string | null;
  title: string;
  description: string | null;
  status: TreatmentPlanStatus;
  started_at: Timestamp | null;
  completed_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TreatmentPlanInsert {
  clinic_id: string;
  patient_id: string;
  quote_id?: string | null;
  title: string;
  description?: string | null;
  status?: TreatmentPlanStatus;
  started_at?: Timestamp | null;
  completed_at?: Timestamp | null;
}

// ---------------------------------------------------------------------------
// treatment_steps
// ---------------------------------------------------------------------------

export interface TreatmentStep {
  id: string;
  treatment_plan_id: string;
  title: string;
  description: string | null;
  status: TreatmentStepStatus;
  order: number;
  completed_at: Timestamp | null;
  created_at: Timestamp;
}

export interface TreatmentStepInsert {
  treatment_plan_id: string;
  title: string;
  description?: string | null;
  status?: TreatmentStepStatus;
  order?: number;
  completed_at?: Timestamp | null;
}

// ---------------------------------------------------------------------------
// patient_portal_tokens
// ---------------------------------------------------------------------------

export interface PatientPortalToken {
  id: string;
  clinic_id: string;
  patient_id: string;
  token: string;
  expires_at: Timestamp | null;
  created_at: Timestamp;
}

export interface PatientPortalTokenInsert {
  clinic_id: string;
  patient_id: string;
  token: string;
  expires_at?: Timestamp | null;
}

// ---------------------------------------------------------------------------
// audit_logs
// ---------------------------------------------------------------------------

export interface AuditLog {
  id: string;
  clinic_id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Json;
  created_at: Timestamp;
}

export interface AuditLogInsert {
  clinic_id: string;
  user_id?: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  metadata?: Json;
}

// ---------------------------------------------------------------------------
// Database type map — useful with Supabase client generics
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: Clinic;
        Insert: ClinicInsert;
        Update: Partial<ClinicInsert>;
      };
      users: {
        Row: User;
        Insert: UserInsert;
        Update: Partial<UserInsert>;
      };
      clinic_members: {
        Row: ClinicMember;
        Insert: ClinicMemberInsert;
        Update: Partial<ClinicMemberInsert>;
      };
      patients: {
        Row: Patient;
        Insert: PatientInsert;
        Update: Partial<PatientInsert>;
      };
      professionals: {
        Row: Professional;
        Insert: ProfessionalInsert;
        Update: Partial<ProfessionalInsert>;
      };
      services: {
        Row: Service;
        Insert: ServiceInsert;
        Update: Partial<ServiceInsert>;
      };
      appointments: {
        Row: Appointment;
        Insert: AppointmentInsert;
        Update: Partial<AppointmentInsert>;
      };
      quotes: {
        Row: Quote;
        Insert: QuoteInsert;
        Update: Partial<QuoteInsert>;
      };
      quote_items: {
        Row: QuoteItem;
        Insert: QuoteItemInsert;
        Update: Partial<QuoteItemInsert>;
      };
      treatment_plans: {
        Row: TreatmentPlan;
        Insert: TreatmentPlanInsert;
        Update: Partial<TreatmentPlanInsert>;
      };
      treatment_steps: {
        Row: TreatmentStep;
        Insert: TreatmentStepInsert;
        Update: Partial<TreatmentStepInsert>;
      };
      patient_portal_tokens: {
        Row: PatientPortalToken;
        Insert: PatientPortalTokenInsert;
        Update: Partial<PatientPortalTokenInsert>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: Partial<AuditLogInsert>;
      };
    };
    Functions: {
      generate_token: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_my_clinic_role: {
        Args: { target_clinic_id: string };
        Returns: string;
      };
    };
  };
}
