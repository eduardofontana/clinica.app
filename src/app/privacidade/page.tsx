import Link from "next/link"
import { SmilePlus } from "lucide-react"

export default function PrivacidadePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
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
          <h1 className="text-4xl font-bold tracking-tight mb-8">Política de Privacidade</h1>
          <div className="prose prose-gray max-w-none space-y-4 text-muted-foreground">
            <p>
              A Clinica.app leva a privacidade dos seus usuários muito a sério. Esta política 
              descreve como coletamos, usamos e protegemos as informações dos nossos clientes.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">Dados que coletamos</h2>
            <p>
              Coletamos apenas os dados necessários para o funcionamento da plataforma: 
              nome, e-mail, telefone e informações profissionais no caso dos dentistas, 
              e dados básicos de cadastro no caso dos pacientes.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">Como usamos seus dados</h2>
            <p>
              Seus dados são utilizados exclusivamente para fornecer os serviços da plataforma: 
              agendamento de consultas, emissão de orçamentos, comunicação com pacientes e 
              gestão da clínica.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">Proteção de dados</h2>
            <p>
              Utilizamos criptografia de ponta a ponta, servidores seguros e seguimos as 
              melhores práticas de segurança da informação. Todos os dados são armazenados 
              em conformidade com a LGPD (Lei Geral de Proteção de Dados).
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">Seus direitos</h2>
            <p>
              Você pode solicitar a exclusão, correção ou exportação dos seus dados a 
              qualquer momento entrando em contato pelo e-mail contato@clinica.app.
            </p>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4">
          &copy; 2026 Clinica.app. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
