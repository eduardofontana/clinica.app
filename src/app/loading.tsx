import { SmilePlus } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <SmilePlus className="size-8 text-primary animate-pulse" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}
