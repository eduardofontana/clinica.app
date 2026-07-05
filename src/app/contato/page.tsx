import Link from "next/link"
import { SmilePlus, Mail, Phone, MapPin } from "lucide-react"

export default function ContatoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <SmilePlus className="size-6 text-primary" />
            <span className="text-primary">Clinica</span>
            <span className="text-muted-foreground">.app</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Contato</h1>
          <div className="space-y-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-primary" />
              <span>contato@clinica.app</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-primary" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-primary" />
              <span>São Paulo, SP - Brasil</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4">
          &copy; {new Date().getFullYear()} Clinica.app. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
