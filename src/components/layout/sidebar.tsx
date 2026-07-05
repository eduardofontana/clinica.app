"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChartNoAxesCombined,
  DollarSign,
  FileText,
  Menu,
  Settings,
  Stethoscope,
  Smile,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", icon: ChartNoAxesCombined },
  { label: "Agenda", href: "/app/agenda", icon: Calendar },
  { label: "Pacientes", href: "/app/pacientes", icon: Users },
  { label: "Profissionais", href: "/app/profissionais", icon: Stethoscope },
  { label: "Serviços", href: "/app/servicos", icon: FileText },
  { label: "Orçamentos", href: "/app/orcamentos", icon: DollarSign },
  { label: "Configurações", href: "/app/configuracoes", icon: Settings },
]

interface SidebarNavProps {
  className?: string
  onItemClick?: () => void
}

function SidebarNav({ className, onItemClick }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

interface SidebarProps {
  className?: string
}

function Sidebar({ className }: SidebarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden w-60 shrink-0 border-r bg-sidebar md:flex md:flex-col",
          className
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Smile className="size-6 text-primary" />
          <span className="font-heading text-base font-semibold">
            Clínica App
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile sheet trigger */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Navegação</SheetTitle>
          <div className="flex h-14 items-center gap-2 border-b px-4">
            <Smile className="size-6 text-primary" />
            <span className="font-heading text-base font-semibold">
              Clínica App
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SidebarNav onItemClick={() => setSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export { Sidebar, SidebarNav, navItems }
