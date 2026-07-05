import type { MemberRole } from "@/lib/constants";
import { MEMBER_ROLES } from "@/lib/constants";

/**
 * Permission-checking utilities for the Clinica.app multi-tenant system.
 *
 * Roles hierarchy:
 * - `admin`         — Full access to all clinic operations
 * - `dentist`       — Access to own appointments and related patients
 * - `receptionist`  — Operational access (scheduling, patient management)
 *
 * All functions accept a `MemberRole | null` for convenience when the
 * role may not be available (e.g., unauthenticated users). `null` will
 * always return `false`.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function hasRole(role: MemberRole | null, ...allowed: MemberRole[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

// ─── Clinic Management ──────────────────────────────────────────────────────

/**
 * Whether the user can manage clinic settings (name, address, branding, etc.).
 * Only admins can configure clinic-level settings.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage clinic settings.
 */
export function canManageClinic(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN);
}

/**
 * Whether the user can manage clinic staff/invite members.
 * Only admins can add or remove team members.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage the team.
 */
export function canManageTeam(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN);
}

// ─── Patient Management ─────────────────────────────────────────────────────

/**
 * Whether the user can create, edit, or delete patients.
 * Admins have full access; receptionists need patient management
 * for their day-to-day work.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage patients.
 */
export function canManagePatients(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN, MEMBER_ROLES.RECEPTIONIST);
}

/**
 * Whether the user can view patient details.
 * All staff roles can view patient information.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can view patient details.
 */
export function canViewPatients(role: MemberRole | null): boolean {
  return hasRole(
    role,
    MEMBER_ROLES.ADMIN,
    MEMBER_ROLES.DENTIST,
    MEMBER_ROLES.RECEPTIONIST,
  );
}

// ─── Appointment Management ─────────────────────────────────────────────────

/**
 * Whether the user can create, edit, or cancel appointments.
 * Admins and receptionists can manage all appointments.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage appointments.
 */
export function canManageAppointments(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN, MEMBER_ROLES.RECEPTIONIST);
}

/**
 * Whether the user can view all appointments across the clinic.
 * Admins and receptionists see the full schedule; dentists
 * only see their own (handled via RLS/data filtering).
 *
 * @param role - The user's member role.
 * @returns `true` if the user can view all appointments.
 */
export function canViewAllAppointments(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN, MEMBER_ROLES.RECEPTIONIST);
}

/**
 * Whether the user can view their own appointments.
 * All clinic staff can view at least their own.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can view their appointments.
 */
export function canViewOwnAppointments(role: MemberRole | null): boolean {
  return hasRole(
    role,
    MEMBER_ROLES.ADMIN,
    MEMBER_ROLES.DENTIST,
    MEMBER_ROLES.RECEPTIONIST,
  );
}

/**
 * Whether the user can update appointment status (e.g., confirm,
 * mark as completed, cancel).
 *
 * @param role - The user's member role.
 * @returns `true` if the user can update appointment status.
 */
export function canUpdateAppointmentStatus(
  role: MemberRole | null,
): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN, MEMBER_ROLES.RECEPTIONIST);
}

// ─── Quote Management ───────────────────────────────────────────────────────

/**
 * Whether the user can create, edit, and manage quotes.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage quotes.
 */
export function canManageQuotes(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN, MEMBER_ROLES.RECEPTIONIST);
}

/**
 * Whether the user can view quote details.
 * All staff roles can view quotes relevant to them.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can view quotes.
 */
export function canViewQuotes(role: MemberRole | null): boolean {
  return hasRole(
    role,
    MEMBER_ROLES.ADMIN,
    MEMBER_ROLES.DENTIST,
    MEMBER_ROLES.RECEPTIONIST,
  );
}

/**
 * Whether the user can approve/reject quotes on behalf of the clinic.
 * Only admins can finalize quote approvals internally.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can approve quotes.
 */
export function canApproveQuotes(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN);
}

// ─── Professional Management ───────────────────────────────────────────────

/**
 * Whether the user can manage professionals (dentists).
 * Only admins can add, edit, or remove professionals.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage professionals.
 */
export function canManageProfessionals(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN);
}

// ─── Service Management ─────────────────────────────────────────────────────

/**
 * Whether the user can manage services (treatments offered).
 * Only admins can configure the service catalog.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage services.
 */
export function canManageServices(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN);
}

// ─── Dashboard Access ───────────────────────────────────────────────────────

/**
 * Whether the user can access the clinic dashboard.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can view the dashboard.
 */
export function canAccessDashboard(role: MemberRole | null): boolean {
  return hasRole(
    role,
    MEMBER_ROLES.ADMIN,
    MEMBER_ROLES.RECEPTIONIST,
  );
}

// ─── Treatment Plan Management ──────────────────────────────────────────────

/**
 * Whether the user can manage treatment plans.
 *
 * @param role - The user's member role.
 * @returns `true` if the user can manage treatment plans.
 */
export function canManageTreatmentPlans(role: MemberRole | null): boolean {
  return hasRole(role, MEMBER_ROLES.ADMIN, MEMBER_ROLES.DENTIST);
}
