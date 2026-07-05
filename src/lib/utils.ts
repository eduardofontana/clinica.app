import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { randomBytes } from "crypto";

// ─── Class Name Merging ─────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names, handling conflicts via `tailwind-merge`.
 * Powered by `clsx` for conditional class logic.
 *
 * @example
 * ```ts
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Formatting ────────────────────────────────────────────────────────

/**
 * Formats a date into a human-readable Brazilian Portuguese string.
 *
 * @param date - A Date, ISO string, or timestamp.
 * @param dateFormat - The desired format pattern (default: "dd/MM/yyyy").
 * @returns The formatted date string.
 *
 * @example
 * ```ts
 * formatDate("2025-03-15")           // "15/03/2025"
 * formatDate(new Date(), "dd 'de' MMM 'de' yyyy") // "15 de mar de 2025"
 * ```
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  dateFormat: string = "dd/MM/yyyy",
): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  return format(dateObj, dateFormat, { locale: ptBR });
}

/**
 * Formats a date with time in Brazilian Portuguese.
 *
 * @param date - A Date, ISO string, or timestamp.
 * @returns The formatted date and time string (e.g., "15/03/2025 14:30").
 *
 * @example
 * ```ts
 * formatDateTime("2025-03-15T14:30:00") // "15/03/2025 14:30"
 * ```
 */
export function formatDateTime(
  date: Date | string | number | null | undefined,
): string {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm");
}

/**
 * Formats a time-only value.
 *
 * @param date - A Date, ISO string, or timestamp.
 * @returns The formatted time string (e.g., "14:30").
 *
 * @example
 * ```ts
 * formatTime("2025-03-15T14:30:00") // "14:30"
 * ```
 */
export function formatTime(
  date: Date | string | number | null | undefined,
): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  return format(dateObj, "HH:mm", { locale: ptBR });
}

/**
 * Returns a relative time description (e.g., "há 2 horas", "em 3 dias").
 *
 * @param date - A Date, ISO string, or timestamp.
 * @returns The relative time string.
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date()) // "há menos de um minuto"
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined,
): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: ptBR,
  });
}

/**
 * Formats a duration in minutes as a human-readable string.
 *
 * @param minutes - The duration in minutes.
 * @returns The formatted duration (e.g., "1h 30min").
 *
 * @example
 * ```ts
 * formatDuration(90) // "1h 30min"
 * formatDuration(45) // "45min"
 * ```
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes && minutes !== 0) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

/**
 * Returns a friendly label for a date relative to today.
 *
 * @param date - A Date, ISO string, or timestamp.
 * @returns A friendly label: "Hoje", "Amanhã", "Ontem", or the formatted date.
 *
 * @example
 * ```ts
 * getRelativeDayLabel(new Date()) // "Hoje"
 * ```
 */
export function getRelativeDayLabel(
  date: Date | string | number | null | undefined,
): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  if (isToday(dateObj)) return "Hoje";
  if (isTomorrow(dateObj)) return "Amanhã";
  if (isYesterday(dateObj)) return "Ontem";
  return formatDate(dateObj);
}

// ─── Currency Formatting ────────────────────────────────────────────────────

/**
 * Formats a numeric value as Brazilian Real (BRL) currency.
 *
 * @param value - The numeric value to format.
 * @returns The formatted currency string.
 *
 * @example
 * ```ts
 * formatCurrency(150.5)  // "R$ 150,50"
 * formatCurrency(1000)   // "R$ 1.000,00"
 * ```
 */
export function formatCurrency(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// ─── Token Generation ───────────────────────────────────────────────────────

/**
 * Generates a cryptographically secure random token string.
 *
 * Uses Node.js `crypto.randomBytes` under the hood. Suitable for
 * public tokens (quote links, patient portal access).
 *
 * @param bytes - Number of random bytes (default: 32). Higher = more entropy.
 * @returns A hex-encoded token string.
 *
 * @example
 * ```ts
 * generateToken()        // "a1b2c3d4e5f6..."
 * generateToken(16)      // Shorter token
 * ```
 */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString("hex");
}

/**
 * Generates a URL-safe random token using base64url encoding.
 * Shorter than hex for the same entropy.
 *
 * @param bytes - Number of random bytes (default: 24).
 * @returns A base64url-encoded token string.
 *
 * @example
 * ```ts
 * generateTokenShort()   // "abc123...-xYz"
 * ```
 */
export function generateTokenShort(bytes: number = 24): string {
  return randomBytes(bytes)
    .toString("base64url");
}

// ─── Slug Generation ────────────────────────────────────────────────────────

/**
 * Converts a string into a URL-friendly slug.
 *
 * Handles Portuguese/Latin characters (accents, cedilha).
 *
 * @param text - The text to slugify.
 * @returns The slugified string.
 *
 * @example
 * ```ts
 * slugify("Clínica Sorriso Premium!") // "clinica-sorriso-premium"
 * slugify("São Paulo")               // "sao-paulo"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")                   // Split accented characters
    .replace(/[\u0300-\u036f]/g, "")    // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")       // Remove non-alphanumeric
    .replace(/[\s_]+/g, "-")            // Replace spaces/underscores with hyphens
    .replace(/-+/g, "-")                // Collapse multiple hyphens
    .replace(/^-|-$/g, "");             // Remove leading/trailing hyphens
}

// ─── Phone Formatting ───────────────────────────────────────────────────────

/**
 * Formats a Brazilian phone number string.
 *
 * @param phone - The raw phone number (digits only or formatted).
 * @returns The formatted phone string.
 *
 * @example
 * ```ts
 * formatPhone("11999999999")     // "(11) 99999-9999"
 * formatPhone("1133334444")      // "(11) 3333-4444"
 * ```
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

// ─── Document Formatting (CPF/CNPJ) ─────────────────────────────────────────

/**
 * Formats a CPF (Brazilian individual tax ID) string.
 *
 * @param cpf - The raw CPF (11 digits).
 * @returns The formatted CPF (XXX.XXX.XXX-XX).
 *
 * @example
 * ```ts
 * formatCPF("12345678909") // "123.456.789-09"
 * ```
 */
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return "";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4",
  );
}

/**
 * Formats a CNPJ (Brazilian business tax ID) string.
 *
 * @param cnpj - The raw CNPJ (14 digits).
 * @returns The formatted CNPJ (XX.XXX.XXX/XXXX-XX).
 *
 * @example
 * ```ts
 * formatCNPJ("12345678000199") // "12.345.678/0001-99"
 * ```
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return "";
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
}

// ─── String Truncation ──────────────────────────────────────────────────────

/**
 * Truncates a string to a specified length, adding an ellipsis if needed.
 *
 * @param str - The string to truncate.
 * @param maxLength - Maximum character length (default: 100).
 * @returns The truncated string.
 *
 * @example
 * ```ts
 * truncate("Lorem ipsum dolor sit amet", 10) // "Lorem ipsu..."
 * ```
 */
export function truncate(
  str: string | null | undefined,
  maxLength: number = 100,
): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "...";
}

// ─── Debounce ───────────────────────────────────────────────────────────────

/**
 * Creates a debounced version of a function.
 *
 * @param fn - The function to debounce.
 * @param ms - Debounce delay in milliseconds (default: 300).
 * @returns The debounced function.
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((q: string) => search(q), 300)
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number = 300,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}
