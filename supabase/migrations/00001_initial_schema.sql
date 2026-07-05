-- ============================================================================
-- Clinica.app — Initial Schema Migration
-- ============================================================================
-- This migration creates all core tables for the dental clinic SaaS.
-- It includes: users, clinics, clinic_members, patients, professionals,
-- services, appointments, quotes, quote_items, treatment_plans,
-- treatment_steps, patient_portal_tokens, and audit_logs.
--
-- Also sets up:
--   - UUID primary keys with gen_random_uuid()
--   - TEXT status columns with CHECK constraints (instead of enum types)
--   - Foreign keys with CASCADE deletes where appropriate
--   - Comprehensive indexes on frequently queried columns
--   - Row Level Security (RLS) policies for multi-tenant isolation
--   - Storage bucket policies for clinic-assets, patient-documents, quote-files
--   - Token generation function for public shareable links
--   - Trigger to auto-create user profile on auth.users signup
--   - Updated_at trigger for relevant tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1  clinics
-- ----------------------------------------------------------------------------
CREATE TABLE clinics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  document        TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  description     TEXT,
  logo_url        TEXT,
  banner_url      TEXT,
  whatsapp_number TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.2  users  (public profile, linked to auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.3  clinic_members
-- ----------------------------------------------------------------------------
CREATE TABLE clinic_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('admin', 'dentist', 'receptionist')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (clinic_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 1.4  patients
-- ----------------------------------------------------------------------------
CREATE TABLE patients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  phone      TEXT,
  email      TEXT,
  document   TEXT,
  birth_date DATE,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.5  professionals
-- ----------------------------------------------------------------------------
CREATE TABLE professionals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  cro        TEXT,
  specialty  TEXT,
  bio        TEXT,
  photo_url  TEXT,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.6  services
-- ----------------------------------------------------------------------------
CREATE TABLE services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id        UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  duration_minutes INTEGER,
  base_price       DECIMAL(10, 2),
  category         TEXT,
  active           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.7  appointments
-- ----------------------------------------------------------------------------
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id      UUID REFERENCES services(id) ON DELETE SET NULL,
  start_at        TIMESTAMPTZ NOT NULL,
  end_at          TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN (
                      'scheduled', 'confirmed', 'in_progress',
                      'completed', 'cancelled', 'no_show'
                    )),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.8  quotes
-- ----------------------------------------------------------------------------
CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  total_amount    DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_terms   TEXT,
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN (
                      'draft', 'sent', 'viewed',
                      'approved', 'rejected', 'expired'
                    )),
  public_token    TEXT UNIQUE,
  expires_at      TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.9  quote_items
-- ----------------------------------------------------------------------------
CREATE TABLE quote_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id     UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  quantity     INTEGER NOT NULL DEFAULT 1,
  unit_price   DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_price  DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.10  treatment_plans
-- ----------------------------------------------------------------------------
CREATE TABLE treatment_plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id    UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id   UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  quote_id     UUID REFERENCES quotes(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'completed', 'cancelled', 'on_hold')),
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.11  treatment_steps
-- ----------------------------------------------------------------------------
CREATE TABLE treatment_steps (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'in_progress', 'completed')),
  "order"           INTEGER NOT NULL DEFAULT 0,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.12  patient_portal_tokens
-- ----------------------------------------------------------------------------
CREATE TABLE patient_portal_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 1.13  audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  entity     TEXT NOT NULL,
  entity_id  UUID,
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- clinic_members
CREATE INDEX idx_clinic_members_user_id   ON clinic_members(user_id);
CREATE INDEX idx_clinic_members_clinic_id ON clinic_members(clinic_id);

-- patients
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);

-- professionals
CREATE INDEX idx_professionals_clinic_id ON professionals(clinic_id);

-- services
CREATE INDEX idx_services_clinic_id ON services(clinic_id);

-- appointments
CREATE INDEX idx_appointments_clinic_id        ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id       ON appointments(patient_id);
CREATE INDEX idx_appointments_professional_id  ON appointments(professional_id);
CREATE INDEX idx_appointments_start_at         ON appointments(start_at);

-- quotes
CREATE INDEX idx_quotes_clinic_id      ON quotes(clinic_id);
CREATE INDEX idx_quotes_patient_id     ON quotes(patient_id);
CREATE INDEX idx_quotes_public_token   ON quotes(public_token);

-- quote_items
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);

-- treatment_plans
CREATE INDEX idx_treatment_plans_clinic_id  ON treatment_plans(clinic_id);
CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);

-- treatment_steps
CREATE INDEX idx_treatment_steps_plan_id ON treatment_steps(treatment_plan_id);

-- patient_portal_tokens
CREATE INDEX idx_patient_portal_tokens_clinic_id  ON patient_portal_tokens(clinic_id);
CREATE INDEX idx_patient_portal_tokens_patient_id ON patient_portal_tokens(patient_id);
CREATE INDEX idx_patient_portal_tokens_token      ON patient_portal_tokens(token);

-- audit_logs
CREATE INDEX idx_audit_logs_clinic_id ON audit_logs(clinic_id);

-- ============================================================================
-- 3. UPDATED_AT TRIGGER FUNCTION & APPLICATION
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_clinics
  BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_patients
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_professionals
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_services
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_appointments
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_quotes
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_treatment_plans
  BEFORE UPDATE ON treatment_plans
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================================
-- 4. TOKEN GENERATION FUNCTION
-- ============================================================================
-- Generates a cryptographically random 64-character hex token suitable for
-- public shareable links (quote public access, patient portal, etc.).

CREATE OR REPLACE FUNCTION generate_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- ============================================================================
-- 5. AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================================
-- When a user signs up via Supabase Auth, automatically create a corresponding
-- entry in the public.users table.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. HELPER FUNCTION FOR RLS
-- ============================================================================
-- Returns the role of the currently authenticated user within a specific clinic.
-- Used by RLS policies to determine access level.

CREATE OR REPLACE FUNCTION public.get_my_clinic_role(target_clinic_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.clinic_members
  WHERE user_id = auth.uid() AND clinic_id = target_clinic_id
  LIMIT 1;
$$;

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE clinics               ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients              ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE services              ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_steps       ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_portal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs            ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 7.1  clinics
-- ---------------------------------------------------------------------------
-- Any authenticated member of a clinic can view its data.
-- Only admin can update the clinic.
-- Public users can view clinic data (for public pages).

CREATE POLICY "Anyone can view clinics"
  ON clinics FOR SELECT
  USING (true);

CREATE POLICY "Admin can update their clinic"
  ON clinics FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM clinic_members
    WHERE clinic_id = id AND role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM clinic_members
    WHERE clinic_id = id AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.2  users
-- ---------------------------------------------------------------------------
-- Users can view their own profile.
-- Clinic members can view other users belonging to the same clinics.

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Clinic members can view users in their clinics"
  ON users FOR SELECT
  USING (id IN (
    SELECT cm.user_id FROM clinic_members cm
    WHERE cm.clinic_id IN (
      SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
    )
  ));

-- ---------------------------------------------------------------------------
-- 7.3  clinic_members
-- ---------------------------------------------------------------------------
-- Members can view all members of their clinics.
-- Only admin can insert, update, or delete members.

CREATE POLICY "Clinic members can view members of their clinics"
  ON clinic_members FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin can invite members"
  ON clinic_members FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can update members"
  ON clinic_members FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can remove members"
  ON clinic_members FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.4  patients
-- ---------------------------------------------------------------------------
-- All clinic members can view patients.
-- Admin and receptionist can insert, update, and delete.

CREATE POLICY "Clinic members can view patients"
  ON patients FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin and receptionist can insert patients"
  ON patients FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ));

CREATE POLICY "Admin and receptionist can update patients"
  ON patients FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ));

CREATE POLICY "Admin and receptionist can delete patients"
  ON patients FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ));

-- ---------------------------------------------------------------------------
-- 7.5  professionals
-- ---------------------------------------------------------------------------
-- All clinic members can view professionals. Public can view active ones.
-- Only admin can insert, update, or delete.

CREATE POLICY "Anyone can view active professionals"
  ON professionals FOR SELECT
  USING (active = true OR clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin can insert professionals"
  ON professionals FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can update professionals"
  ON professionals FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can delete professionals"
  ON professionals FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.6  services
-- ---------------------------------------------------------------------------
-- All clinic members can view services. Public can view active services.
-- Only admin can insert, update, or delete.

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (active = true OR clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin can insert services"
  ON services FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can update services"
  ON services FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can delete services"
  ON services FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.7  appointments
-- ---------------------------------------------------------------------------
-- All clinic members can view appointments.
-- Dentists can also see appointments where they are the professional.
-- Admin and receptionist can insert, update, or delete.

CREATE POLICY "Clinic members can view appointments"
  ON appointments FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Dentists can view their own appointments"
  ON appointments FOR SELECT
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin and receptionist can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ));

CREATE POLICY "Admin and receptionist can update appointments"
  ON appointments FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ));

CREATE POLICY "Admin and receptionist can delete appointments"
  ON appointments FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')
  ));

-- ---------------------------------------------------------------------------
-- 7.8  quotes
-- ---------------------------------------------------------------------------
-- All clinic members can view quotes.
-- Anyone with a valid public_token can view non-draft quotes.
-- Only admin can insert, update, or delete.

CREATE POLICY "Clinic members can view quotes"
  ON quotes FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Public can view non-draft quotes with token"
  ON quotes FOR SELECT
  USING (public_token IS NOT NULL AND status != 'draft');

CREATE POLICY "Admin can insert quotes"
  ON quotes FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can update quotes"
  ON quotes FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can delete quotes"
  ON quotes FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.9  quote_items
-- ---------------------------------------------------------------------------
-- Access is inherited from the parent quote.

CREATE POLICY "View quote items via parent quote"
  ON quote_items FOR SELECT
  USING (quote_id IN (
    SELECT id FROM quotes WHERE
      clinic_id IN (SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid())
      OR (public_token IS NOT NULL AND status != 'draft')
  ));

CREATE POLICY "Admin can insert quote items"
  ON quote_items FOR INSERT
  WITH CHECK (quote_id IN (
    SELECT id FROM quotes WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ));

CREATE POLICY "Admin can update quote items"
  ON quote_items FOR UPDATE
  USING (quote_id IN (
    SELECT id FROM quotes WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ))
  WITH CHECK (quote_id IN (
    SELECT id FROM quotes WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ));

CREATE POLICY "Admin can delete quote items"
  ON quote_items FOR DELETE
  USING (quote_id IN (
    SELECT id FROM quotes WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ));

-- ---------------------------------------------------------------------------
-- 7.10  treatment_plans
-- ---------------------------------------------------------------------------
-- Clinic members can view treatment plans from their clinic.
-- Only admin can insert, update, or delete.

CREATE POLICY "Clinic members can view treatment plans"
  ON treatment_plans FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin can insert treatment plans"
  ON treatment_plans FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can update treatment plans"
  ON treatment_plans FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can delete treatment plans"
  ON treatment_plans FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.11  treatment_steps
-- ---------------------------------------------------------------------------
-- Access is inherited from the parent treatment_plan.

CREATE POLICY "View treatment steps via parent plan"
  ON treatment_steps FOR SELECT
  USING (treatment_plan_id IN (
    SELECT id FROM treatment_plans WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Admin can insert treatment steps"
  ON treatment_steps FOR INSERT
  WITH CHECK (treatment_plan_id IN (
    SELECT id FROM treatment_plans WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ));

CREATE POLICY "Admin can update treatment steps"
  ON treatment_steps FOR UPDATE
  USING (treatment_plan_id IN (
    SELECT id FROM treatment_plans WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ))
  WITH CHECK (treatment_plan_id IN (
    SELECT id FROM treatment_plans WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ));

CREATE POLICY "Admin can delete treatment steps"
  ON treatment_steps FOR DELETE
  USING (treatment_plan_id IN (
    SELECT id FROM treatment_plans WHERE clinic_id IN (
      SELECT clinic_id FROM clinic_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  ));

-- ---------------------------------------------------------------------------
-- 7.12  patient_portal_tokens
-- ---------------------------------------------------------------------------
-- Clinic members can view tokens for their clinic.
-- Only admin can create, update, or delete tokens.

CREATE POLICY "Clinic members can view portal tokens"
  ON patient_portal_tokens FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admin can create portal tokens"
  ON patient_portal_tokens FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can update portal tokens"
  ON patient_portal_tokens FOR UPDATE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admin can delete portal tokens"
  ON patient_portal_tokens FOR DELETE
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- 7.13  audit_logs
-- ---------------------------------------------------------------------------
-- Clinic members can view logs for their clinic.
-- Authenticated members can insert logs.

CREATE POLICY "Clinic members can view audit logs"
  ON audit_logs FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Clinic members can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

-- ============================================================================
-- 8. STORAGE BUCKET POLICIES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 8.1  clinic-assets bucket (logos, banners, public photos)
-- ---------------------------------------------------------------------------
-- Public read access; write access restricted to clinic members.
-- Objects are organized by clinic_id as the top-level folder.

INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic-assets', 'clinic-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view clinic assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clinic-assets');

CREATE POLICY "Clinic members can upload clinic assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'clinic-assets'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can update clinic assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'clinic-assets'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can delete clinic assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'clinic-assets'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 8.2  patient-documents bucket
-- ---------------------------------------------------------------------------
-- Private bucket. Only clinic members can access documents belonging to their
-- clinic. Organized as clinic_id/patient_id/filename.

INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-documents', 'patient-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Clinic members can view patient documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'patient-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can upload patient documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'patient-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can update patient documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'patient-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can delete patient documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'patient-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 8.3  quote-files bucket
-- ---------------------------------------------------------------------------
-- Private bucket. Used for attachments related to quotes.
-- Access restricted to clinic members.

INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-files', 'quote-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Clinic members can view quote files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'quote-files'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can upload quote files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'quote-files'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can update quote files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'quote-files'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic members can delete quote files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'quote-files'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN (
      SELECT clinic_id::text FROM clinic_members WHERE user_id = auth.uid()
    )
  );
