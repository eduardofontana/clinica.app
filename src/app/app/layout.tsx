import type { Metadata } from "next"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getUserOrRedirect, getClinicId } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: {
    template: "%s | Clinica.app",
    default: "Dashboard | Clinica.app",
  },
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserOrRedirect()
  const clinicId = await getClinicId()

  // Fetch user profile data from the public users table
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", user.id)
    .single()

  const userName = profile?.name ?? user.user_metadata?.name ?? null
  const userEmail = profile?.email ?? user.email ?? null

  return (
    <DashboardLayout
      user={{
        name: userName,
        email: userEmail,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
