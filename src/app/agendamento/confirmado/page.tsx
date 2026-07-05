import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Agendamento Confirmado | Clinica.app",
}

export default async function AgendamentoConfirmadoPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="size-8" />
            </div>
          </div>
          <CardTitle className="text-xl">
            Agendamento confirmado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Seu agendamento foi realizado com sucesso. Você receberá
            um e-mail ou mensagem de confirmação com os detalhes da
            consulta.
          </p>
          <p className="text-sm text-muted-foreground">
            Caso precise remarcar ou cancelar, entre em contato com a
            clínica pelo telefone ou WhatsApp.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Página inicial</Button>
          </Link>
          <Link href="/c">
            <Button>Voltar para clínica</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
