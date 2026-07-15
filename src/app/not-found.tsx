import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="size-8" />
      </div>
      <h2 className="text-xl font-bold mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        A página que você procura não existe ou foi movida.
      </p>
      <Link href="/">
        <Button variant="outline">Voltar ao início</Button>
      </Link>
    </div>
  )
}
