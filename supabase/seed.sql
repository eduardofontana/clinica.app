-- ============================================================================
-- Clinica.app — Seed Data
-- ============================================================================
-- This seed file populates the database with realistic sample data for
-- local development and testing.
--
-- Content:
--   1. Clinic: Sorriso Premium Odontologia
--   2. Users (created in auth.users — triggers auto-create public.users)
--   3. Clinic members (admin, 2 dentists, 1 receptionist)
--   4. Services (5 procedures)
--   5. Patients (3 sample patients)
--   6. Professionals (linked to dentist users)
--   7. Appointments (today and tomorrow)
--   8. Quote with items (approved)
--   9. Patient portal token
--
-- All passwords are: senha123
--
-- IMPORTANT: This seed requires pgcrypto extension (enabled in migration).
-- ============================================================================

-- ============================================================================
-- 1. CLINIC
-- ============================================================================

INSERT INTO clinics (id, name, slug, document, phone, email, address, description, whatsapp_number)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'Sorriso Premium Odontologia',
  'sorriso-premium',
  '12.345.678/0001-90',
  '(11) 99999-8888',
  'contato@sorrisopremium.com.br',
  'Av. Paulista, 1000, Bela Vista, São Paulo - SP, CEP 01310-100',
  'ClÃ­nica odontolÃ³gica especializada em tratamentos estÃ©ticos e reabilitadores. HÃ¡ mais de 15 anos transformando sorrisos.',
  '5511999998888'
);

-- ============================================================================
-- 2. USERS  (auth.users + trigger creates public.users automatically)
-- ============================================================================
-- Passwords are hashed with bcrypt using pgcrypto's crypt() + gen_salt().
-- All users have password: senha123

INSERT INTO auth.users (
  id, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, aud, role, confirmation_token,
  email_change, email_change_token_new, recovery_token
)
SELECT
  id, email,
  crypt('senha123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('name', name, 'role', role),
  now(), now(), 'authenticated', 'authenticated',
  '', '', '', ''
FROM (
  VALUES
    ('u0000000-0000-0000-0000-000000000001', 'admin@sorrisopremium.com.br', 'Dr. Carlos Almeida', 'admin'),
    ('u0000000-0000-0000-0000-000000000002', 'dr.fernanda@sorrisopremium.com.br', 'Dra. Fernanda Santos', 'dentist'),
    ('u0000000-0000-0000-0000-000000000003', 'dr.ricardo@sorrisopremium.com.br', 'Dr. Ricardo Oliveira', 'dentist'),
    ('u0000000-0000-0000-0000-000000000004', 'recepcao@sorrisopremium.com.br', 'Juliana Costa', 'receptionist')
) AS u(id, email, name, role);

-- ============================================================================
-- 3. CLINIC MEMBERS
-- ============================================================================

INSERT INTO clinic_members (id, clinic_id, user_id, role)
VALUES
  ('m0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'admin'),
  ('m0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', 'dentist'),
  ('m0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003', 'dentist'),
  ('m0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004', 'receptionist');

-- ============================================================================
-- 4. PROFESSIONALS  (linked to clinic and optionally to user)
-- ============================================================================

INSERT INTO professionals (id, clinic_id, user_id, name, email, phone, cro, specialty, bio, active)
VALUES
  (
    'pr000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'u0000000-0000-0000-0000-000000000002',
    'Dra. Fernanda Santos',
    'dr.fernanda@sorrisopremium.com.br',
    '(11) 98888-7777',
    'CRO-SP 123456',
    'DentÃ­stica e EstÃ©tica',
    'Especialista em estÃ©tica dental com formaÃ§Ã£o pela USP. Apaixonada por transformar sorrisos.',
    true
  ),
  (
    'pr000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'u0000000-0000-0000-0000-000000000003',
    'Dr. Ricardo Oliveira',
    'dr.ricardo@sorrisopremium.com.br',
    '(11) 97777-6666',
    'CRO-SP 789012',
    'Implante e Cirurgia',
    'CirurgiÃ£o dentista especializado em implantes e reabilitaÃ§Ã£o oral.',
    true
  );

-- ============================================================================
-- 5. SERVICES
-- ============================================================================

INSERT INTO services (id, clinic_id, name, description, duration_minutes, base_price, category, active)
VALUES
  (
    's0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'AvaliaÃ§Ã£o OdontolÃ³gica',
    'Consulta inicial com exame clÃ­nico completo e planejamento do tratamento.',
    60,
    150.00,
    'AvaliaÃ§Ã£o',
    true
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'Limpeza Dental',
    'Profilaxia profissional com remoÃ§Ã£o de tÃ¡rtaro, placa bacteriana e polimento.',
    45,
    200.00,
    'PrevenÃ§Ã£o',
    true
  ),
  (
    's0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'Clareamento Dental',
    'Clareamento dental a laser com moldeiras personalizadas. Resultado atÃ© 8 tons.',
    90,
    1200.00,
    'EstÃ©tica',
    true
  ),
  (
    's0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000001',
    'RestauraÃ§Ã£o Dental',
    'RestauraÃ§Ã£o em resina composta para dentes anteriores e posteriores.',
    60,
    350.00,
    'Restauradora',
    true
  ),
  (
    's0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    'Tratamento de Canal',
    'Endodontia completa com anestesia e material odontolÃ³gico de alta qualidade.',
    120,
    1800.00,
    'Endodontia',
    true
  );

-- ============================================================================
-- 6. PATIENTS
-- ============================================================================

INSERT INTO patients (id, clinic_id, name, phone, email, document, birth_date, notes)
VALUES
  (
    'p0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Maria Aparecida Silva',
    '(11) 95555-1111',
    'maria.silva@email.com.br',
    '123.456.789-00',
    '1985-03-15',
    'Paciente regular, realiza limpeza a cada 6 meses. Possui sensibilidade nos dentes inferiores.'
  ),
  (
    'p0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'JoÃ£o Carlos Santos',
    '(11) 95555-2222',
    'joao.santos@email.com.br',
    '987.654.321-00',
    '1990-07-22',
    'Primeira consulta. Encaminhado por convÃªnio. Relata dor no molar superior direito.'
  ),
  (
    'p0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'Ana Paula de Lima',
    '(11) 95555-3333',
    'ana.lima@email.com.br',
    '456.789.123-00',
    '1995-11-08',
    'Interessada em clareamento dental. JÃ¡ realizou tratamento ortodÃ´ntico.'
  );

-- ============================================================================
-- 7. APPOINTMENTS
-- ============================================================================

-- Today's appointment: Maria Silva with Dra. Fernanda for Limpeza
INSERT INTO appointments (id, clinic_id, patient_id, professional_id, service_id, start_at, end_at, status, notes)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000001',
    'pr000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000002',
    date_trunc('day', now()) + interval '9 hours',
    date_trunc('day', now()) + interval '9 hours' + interval '45 minutes',
    'confirmed',
    'Limpeza de rotina. Paciente com sensibilidade.'
  );

-- Tomorrow's appointment: Joao Santos with Dr. Ricardo for Avaliacao
INSERT INTO appointments (id, clinic_id, patient_id, professional_id, service_id, start_at, end_at, status, notes)
VALUES
  (
    'a0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000002',
    'pr000000-0000-0000-0000-000000000002',
    's0000000-0000-0000-0000-000000000001',
    date_trunc('day', now()) + interval '1 day' + interval '14 hours',
    date_trunc('day', now()) + interval '1 day' + interval '14 hours' + interval '1 hour',
    'scheduled',
    'Primeira consulta. Dor no molar superior direito.'
  );

-- ============================================================================
-- 8. QUOTE WITH ITEMS
-- ============================================================================
-- An approved quote for Ana Paula Lima - Clareamento Dental

-- First, create the quote
INSERT INTO quotes (id, clinic_id, patient_id, professional_id, title, description, total_amount, payment_terms, status, public_token, expires_at, approved_at)
VALUES
  (
    'q0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000003',
    'pr000000-0000-0000-0000-000000000001',
    'Clareamento Dental - Plano Completo',
    'Plano de clareamento dental completo incluindo avaliaÃ§Ã£o inicial, clareamento a laser e moldeiras personalizadas para manutenÃ§Ã£o.',
    2000.00,
    'Ã€ vista com 10% de desconto: R$ 1.800,00 | Parcelado em atÃ© 6x sem juros no cartÃ£o',
    'approved',
    generate_token(),
    now() + interval '30 days',
    now() - interval '2 days'
  );

-- Then, the quote items
INSERT INTO quote_items (id, quote_id, name, description, quantity, unit_price, total_price)
VALUES
  (
    'qi000000-0000-0000-0000-000000000001',
    'q0000000-0000-0000-0000-000000000001',
    'AvaliaÃ§Ã£o OdontolÃ³gica Inicial',
    'Exame clÃ­nico completo e planejamento do clareamento.',
    1,
    150.00,
    150.00
  ),
  (
    'qi000000-0000-0000-0000-000000000002',
    'q0000000-0000-0000-0000-000000000001',
    'Clareamento Dental a Laser',
    'SessÃ£o de clareamento dental com laser de LED e gel clareador profissional.',
    2,
    600.00,
    1200.00
  ),
  (
    'qi000000-0000-0000-0000-000000000003',
    'q0000000-0000-0000-0000-000000000001',
    'Moldeiras Personalizadas',
    'Par de moldeiras de silicone personalizadas para manutenÃ§Ã£o do clareamento em casa.',
    1,
 250.00,
    250.00
  ),
  (
    'qi000000-0000-0000-0000-000000000004',
    'q0000000-0000-0000-0000-000000000001',
    'Kit ManutenÃ§Ã£o',
    'Kit com gel clareador de manutenÃ§Ã£o e escova dental profissional.',
    2,
    200.00,
    400.00
  );

-- ============================================================================
-- 9. PATIENT PORTAL TOKEN
-- ============================================================================
-- Token for Ana Paula Lima to access the patient portal.

INSERT INTO patient_portal_tokens (id, clinic_id, patient_id, token, expires_at)
VALUES
  (
    't0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000003',
    generate_token(),
    now() + interval '90 days'
  );
