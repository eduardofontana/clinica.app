-- ============================================================================
-- Migration: 00002_security_performance_fixes
-- Fix RLS policies, add composite indexes, add CHECK constraint
-- ============================================================================

-- 1. Fix professionals SELECT: remove inverted logic
-- Previously: active = true OR clinic_id IN (...)
-- This allowed anyone to see inactive professionals from other clinics
DROP POLICY IF EXISTS "Anyone can view active professionals" ON professionals;
CREATE POLICY "Public can view active professionals"
  ON professionals FOR SELECT
  USING (active = true);

CREATE POLICY "Clinic members can view their professionals"
  ON professionals FOR SELECT
  USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members WHERE user_id = auth.uid()
  ));

-- 2. Add CHECK constraint for appointment times
ALTER TABLE appointments
  ADD CONSTRAINT appointments_end_after_start CHECK (end_at > start_at);

-- 3. Add composite indexes for common query patterns
CREATE INDEX idx_appointments_clinic_status ON appointments (clinic_id, status);
CREATE INDEX idx_appointments_clinic_start ON appointments (clinic_id, start_at);
CREATE INDEX idx_quotes_clinic_status ON quotes (clinic_id, status);
CREATE INDEX idx_patients_clinic_name ON patients (clinic_id, name);
CREATE INDEX idx_services_clinic_active ON services (clinic_id, active);
CREATE INDEX idx_professionals_clinic_active ON professionals (clinic_id, active);

-- 4. Add CHECK constraint for quote_items total_price
ALTER TABLE quote_items
  ADD CONSTRAINT quote_items_total_price_check
  CHECK (total_price >= 0);
