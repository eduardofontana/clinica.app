import type { ReactNode } from "react"
import Link from "next/link"
import { Smile } from "lucide-react"

import { cn } from "@/lib/utils"

export interface PublicLayoutProps {
  children: ReactNode
  className?: string
  clinicName?: string
  showFooter?: boolean
}

function PublicLayout({
  children,
  className,
  clinicName,
  showFooter = true,
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Smile className="size-6 text-primary" />
            <span className="font-heading text-base font-semibold">
              {clinicName ?? "Clínica App"}
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className={cn("flex-1", className)}>{children}</main>

      {/* Footer */}
      {showFooter && (
        <footer className="border-t py-6">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Clínica App. Todos os direitos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  )
}

export { PublicLayout }
