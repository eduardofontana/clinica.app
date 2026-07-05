import Link from "next/link"
import { SmilePlus } from "lucide-react"

export default function SobrePage() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-8">Sobre a Clinica.app</h1>
          <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p>
              A Clinica.app nasceu da necessidade de simplificar a gestão de clínicas odontológicas no Brasil. 
              Percebemos que muitos dentistas gastavam tempo demais com burocracia e tarefas repetitivas, 
              em vez de focar no que realmente importa: atender bem seus pacientes.
            </p>
            <p>
              Nossa plataforma oferece todas as ferramentas essenciais para o dia a dia de uma clínica: 
              agenda inteligente, página profissional, agendamento online, orçamentos digitais e portal do paciente.
            </p>
            <p>
              Hoje, mais de 500 clínicas confiam na Clinica.app para gerenciar seus consultórios, 
              e nossos números só crescem. Nosso compromisso é continuar inovando e oferecendo 
              a melhor experiência para dentistas e pacientes.
            </p>
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
