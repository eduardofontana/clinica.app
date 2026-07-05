import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Globe,
  CalendarCheck,
  FileText,
  UserRound,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Smartphone,
  BarChart3,
  SmilePlus,
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description:
      "Organize consultas com visualização diária, semanal ou mensal. Filtre por profissional e acompanhe o status de cada atendimento em tempo real.",
  },
  {
    icon: Globe,
    title: "Página Profissional",
    description:
      "Cada clínica tem uma página pública com serviços, profissionais e agendamento online integrado. Uma verdadeira vitrine digital.",
  },
  {
    icon: CalendarCheck,
    title: "Agendamento Online 24h",
    description:
      "Pacientes agendam consultas a qualquer hora. O sistema mostra apenas horários disponíveis, eliminando conflitos de agenda.",
  },
  {
    icon: FileText,
    title: "Orçamento Digital",
    description:
      "Crie orçamentos profissionais com aparência de alta qualidade. Envie por link e permita que o paciente aprove com um clique.",
  },
  {
    icon: UserRound,
    title: "Portal do Paciente",
    description:
      "Cada paciente tem um portal seguro para acompanhar consultas, ver orçamentos e gerenciar seu tratamento de onde estiver.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    description:
      "Métricas em tempo real: consultas do dia, novos pacientes, taxa de comparecimento e orçamentos pendentes.",
  },
]

const stats = [
  { value: "500+", label: "Clínicas ativas" },
  { value: "15mil+", label: "Consultas realizadas" },
  { value: "98%", label: "Satisfação" },
  { value: "5min", label: "Para começar" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <SmilePlus className="size-6 text-primary" />
            <span className="text-primary">Clinica</span>
            <span className="text-muted-foreground">.app</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#funcionalidades" className="hover:text-foreground transition-colors">
              Funcionalidades
            </Link>
            <Link href="#beneficios" className="hover:text-foreground transition-colors">
              Benefícios
            </Link>
            <Link href="#precos" className="hover:text-foreground transition-colors">
              Preços
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white dark:from-background dark:via-background dark:to-muted/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-white/50 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5 text-primary" />
              Plataforma digital completa para clínicas odontológicas
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
              Sua clínica odontológica{" "}
              <span className="text-primary">online</span>
              <br />
              e organizada
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Agenda inteligente, página profissional, agendamento online,
              orçamentos digitais e portal do paciente — tudo integrado em uma
              plataforma feita para dentistas.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-lg shadow-primary/25">
                  Começar gratuitamente
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="#funcionalidades">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8">
                  Ver funcionalidades
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 rounded-2xl border bg-white/50 p-8 backdrop-blur-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Tudo que sua clínica precisa
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ferramentas completas para gerenciar sua clínica odontológica e
              encantar seus pacientes.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-20 sm:py-28 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Por que escolher a Clinica.app?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Mais de 500 clínicas já transformaram sua gestão com nossa plataforma.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  ["Reduz trabalho manual da recepção", "Automatize agendamentos, lembretes e comunicações."],
                  ["Aumenta a conversão de avaliações em tratamentos", "Orçamentos digitais que pacientes aprovam em segundos."],
                  ["Melhora a experiência do paciente", "Portal simples e intuitivo para acompanhar tudo."],
                  ["Profissionaliza a imagem da clínica", "Página pública moderna com agendamento integrado."],
                  ["Funciona em qualquer dispositivo", "Celular, tablet e computador — sempre responsivo."],
                  ["Dados seguros na nuvem", "Proteção com criptografia e backups automáticos."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 text-primary shrink-0" />
                    <div>
                      <span className="font-medium">{title}</span>
                      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border bg-card p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <SmilePlus className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Dra. Fernanda Santos</div>
                    <div className="text-sm text-muted-foreground">Sorriso Premium Odontologia</div>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic leading-relaxed">
                  "A Clinica.app transformou a gestão do meu consultório. Reduzi em 70% o
                  trabalho manual da recepção e meus pacientes amam o portal. Recomendo de olhos fechados."
                </blockquote>
                <div className="mt-4 flex gap-1 text-amber-400">
                  {"★★★★★"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="precos" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-16 sm:px-16 sm:py-20 text-center text-primary-foreground shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Comece hoje mesmo
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Crie sua conta gratuita e descubra como a Clinica.app pode
                transformar a gestão da sua clínica odontológica.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base h-12 px-8 shadow-lg">
                    Criar conta gratuita
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-primary-foreground/60">
                Sem cartão de crédito • Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <SmilePlus className="size-5 text-primary" />
                <span className="text-primary">Clinica</span>
                <span className="text-muted-foreground">.app</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma digital para clínicas odontológicas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
                <li><Link href="#precos" className="hover:text-foreground transition-colors">Preços</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Criar conta</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sobre" className="hover:text-foreground transition-colors">Sobre</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-foreground transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Clinica.app. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
