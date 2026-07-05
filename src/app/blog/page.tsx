import Link from "next/link"
import { SmilePlus } from "lucide-react"

export default function BlogPage() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-8">Blog</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Dicas, novidades e conteúdos sobre gestão odontológica.
          </p>
          <div className="space-y-6">
            {[
              { title: "Como reduzir faltas em consultas odontológicas", date: "15 Jun 2026" },
              { title: "Orçamento digital: como aumentar a conversão de tratamentos", date: "8 Jun 2026" },
              { title: "Guia completo de agendamento online para clínicas", date: "1 Jun 2026" },
              { title: "5 passos para digitalizar sua clínica odontológica", date: "25 Mai 2026" },
            ].map((post) => (
              <article key={post.title} className="rounded-xl border p-6 transition hover:shadow-md">
                <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </article>
            ))}
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
