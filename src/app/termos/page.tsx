import Link from "next/link"
import { SmilePlus } from "lucide-react"

export default function TermosPage() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-8">Termos de Uso</h1>
          <div className="prose prose-gray max-w-none space-y-4 text-muted-foreground">
            <p>
              Ao utilizar a plataforma Clinica.app, você concorda com os termos e condições 
              descritos abaixo. Recomendamos a leitura completa deste documento.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">1. Serviços</h2>
            <p>
              A Clinica.app oferece uma plataforma SaaS para gestão de clínicas odontológicas, 
              incluindo agenda, página profissional, agendamento online, orçamentos digitais 
              e portal do paciente.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">2. Responsabilidades</h2>
            <p>
              O usuário é responsável pela veracidade dos dados cadastrados e pelo uso 
              adequado da plataforma. A Clinica.app se compromete a manter a plataforma 
              operacional e segura.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">3. Cancelamento</h2>
            <p>
              O usuário pode cancelar sua conta a qualquer momento. Os dados serão 
              mantidos por 30 dias para possível recuperação e depois excluídos 
              permanentemente.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">4. Contato</h2>
            <p>
              Para questões legais, entre em contato pelo e-mail contato@clinica.app.
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
