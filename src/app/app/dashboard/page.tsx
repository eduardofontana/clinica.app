import { startOfMonth, endOfDay, startOfDay } from "date-fns"

import { createClient } from "@/lib/supabase/server"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { PageHeader } from "@/components/shared/page-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { TodayAppointments } from "@/components/dashboard/today-appointments"
import { RecentQuotes } from "@/components/dashboard/recent-quotes"
import { QuickActions } from "@/components/dashboard/quick-actions"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  await getUserOrRedirect()
  const clinicId = await getClinicId()

  if (!clinicId) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Você ainda não está vinculado a uma clínica."
        />
      </div>
    )
  }

  // Date boundaries for today
  const now = new Date()
  const todayStart = startOfDay(now).toISOString()
  const todayEnd = endOfDay(now).toISOString()

  // Date boundaries for this month
  const monthStart = startOfMonth(now).toISOString()

  // ─── Queries ──────────────────────────────────────────────────────────────

  const [
    { count: todayAppointmentsCount },
    { count: todayCompletedCount },
    { count: newPatientsCount },
    { count: pendingQuotesCount },
    { count: approvedQuotesCount },
    todayAppointmentsResult,
    recentQuotesResult,
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .gte("start_at", todayStart)
      .lte("start_at", todayEnd),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .gte("start_at", todayStart)
      .lte("start_at", todayEnd)
      .in("status", ["completed", "in_progress"]),

    supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .gte("created_at", monthStart),

    supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .in("status", ["draft", "sent", "viewed"]),

    supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .eq("status", "approved"),

    supabase
      .from("appointments")
      .select("id, start_at, end_at, status, patients!inner(name), professionals!inner(name), services!left(name)")
      .eq("clinic_id", clinicId)
      .gte("start_at", todayStart)
      .lte("start_at", todayEnd)
      .order("start_at", { ascending: true })
      .limit(5),

    supabase
      .from("quotes")
      .select("id, title, total_amount, status, created_at, patients!inner(name)")
      .eq("clinic_id", clinicId)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  // ─── Compute metrics ──────────────────────────────────────────────────────

  const todayTotal = todayAppointmentsCount ?? 0
  const todayCompleted = todayCompletedCount ?? 0
  const attendanceRate =
    todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 100

  // ─── Map data ─────────────────────────────────────────────────────────────

  const appointments = (todayAppointmentsResult.data ?? []).map((a) => ({
    id: a.id,
    start_at: a.start_at,
    end_at: a.end_at,
    status: a.status,
    patient: (a.patients as { name: string }[])?.[0] ?? null,
    professional: (a.professionals as { name: string }[])?.[0] ?? null,
    service: (a.services as { name: string }[])?.[0] ?? null,
  }))

  const quotes = (recentQuotesResult.data ?? []).map((q) => ({
    id: q.id,
    title: q.title,
    total_amount: q.total_amount,
    status: q.status,
    created_at: q.created_at,
    patient: (q.patients as { name: string }[])?.[0] ?? null,
  }))

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da clínica"
      />

      <DashboardCards
        todayAppointments={todayTotal}
        newPatientsThisMonth={newPatientsCount ?? 0}
        pendingQuotes={pendingQuotesCount ?? 0}
        attendanceRate={attendanceRate}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayAppointments appointments={appointments} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentQuotes quotes={quotes} />
        </div>
      </div>
    </div>
  )
}
