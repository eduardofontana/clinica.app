"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <h2 className="text-xl font-bold mb-2">Erro no painel</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
      </p>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
