"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  CircleQuestionMark,
  LogOut,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/layout/sidebar"

export interface DashboardLayoutProps {
  children: ReactNode
  className?: string
  user?: {
    name?: string | null
    email?: string | null
    avatarUrl?: string | null
  }
}

function DashboardLayout({
  children,
  className,
  user,
}: DashboardLayoutProps) {
  const router = useRouter()

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD"

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Ajuda">
              <CircleQuestionMark className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                  aria-label="Menu do usuário"
                >
                  <Avatar size="sm">
                    {user?.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name ?? ""} />
                    )}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">
                    {user?.name ?? "Admin"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuLabel>
                  {user?.name ?? "Admin"}
                  {user?.email && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/app/configuracoes")}>
                  <Settings className="size-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/auth/logout")}>
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export { DashboardLayout }
