"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Send, Copy, Trash2, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { generateTokenShort } from "@/lib/utils"

interface QuoteActionsProps {
  quoteId: string
  quoteStatus: string
  publicLink: string | null
  currentToken: string | null
}

function QuoteActions({
  quoteId,
  quoteStatus,
  publicLink,
  currentToken,
}: QuoteActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSend = () => {
    startTransition(async () => {
      const supabase = createClient()

      // Generate public token if not exists
      let token = currentToken
      if (!token) {
        token = generateTokenShort()
        const { error: tokenError } = await supabase
          .from("quotes")
          .update({
            public_token: token,
            status: "sent",
          })
          .eq("id", quoteId)

        if (tokenError) {
          toast.error(`Erro ao enviar orçamento: ${tokenError.message}`)
          return
        }
      } else {
        const { error: statusError } = await supabase
          .from("quotes")
          .update({ status: "sent" })
          .eq("id", quoteId)

        if (statusError) {
          toast.error(`Erro ao enviar orçamento: ${statusError.message}`)
          return
        }
      }

      const link = `${window.location.origin}/orcamento/${token}`
      toast.success("Orçamento enviado com sucesso!", {
        description: `Link público: ${link}`,
        action: {
          label: "Copiar",
          onClick: () => copyToClipboard(link),
        },
      })

      router.refresh()
    })
  }

  const handleCopyLink = () => {
    if (!publicLink && !currentToken) {
      toast.error("Gere o link público primeiro enviando o orçamento.")
      return
    }

    const link =
      publicLink ?? `${window.location.origin}/orcamento/${currentToken}`
    copyToClipboard(link)
  }

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return

    startTransition(async () => {
      const supabase = createClient()

      // Delete items first
      await supabase.from("quote_items").delete().eq("quote_id", quoteId)

      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", quoteId)

      if (error) {
        toast.error(`Erro ao excluir orçamento: ${error.message}`)
        return
      }

      toast.success("Orçamento excluído com sucesso.")
      router.push("/app/orcamentos")
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {(quoteStatus === "draft" || quoteStatus === "rejected") && (
        <Button
          variant="default"
          size="sm"
          className="w-full justify-start"
          disabled={isPending}
          onClick={handleSend}
        >
          <Send className="size-4" />
          Enviar para o paciente
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        disabled={isPending}
        onClick={handleCopyLink}
      >
        <Copy className="size-4" />
        Copiar link público
      </Button>

      {publicLink && (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          
        >
          <a href={publicLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" />
            Visualizar página pública
          </a>
        </Button>
      )}

      <Button
        variant="destructive"
        size="sm"
        className="w-full justify-start"
        disabled={isPending}
        onClick={handleDelete}
      >
        <Trash2 className="size-4" />
        Excluir orçamento
      </Button>
    </div>
  )
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success("Link copiado para a área de transferência!"),
    () => toast.error("Erro ao copiar link."),
  )
}

export { QuoteActions }
