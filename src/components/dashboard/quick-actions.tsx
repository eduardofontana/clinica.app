import Link from "next/link"
import { UserPlus, CalendarPlus, FilePlus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  {
    label: "Novo Paciente",
    href: "/app/pacientes/novo",
    icon: UserPlus,
    variant: "default" as const,
  },
  {
    label: "Nova Consulta",
    href: "/app/agenda/novo",
    icon: CalendarPlus,
    variant: "outline" as const,
  },
  {
    label: "Novo Orçamento",
    href: "/app/orcamentos/novo",
    icon: FilePlus,
    variant: "outline" as const,
  },
]

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.href}
              variant={action.variant}
              size="default"
              className="w-full justify-start gap-2"
              
            >
              <Link href={action.href}>
                <Icon className="size-4" />
                {action.label}
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

export { QuickActions }
