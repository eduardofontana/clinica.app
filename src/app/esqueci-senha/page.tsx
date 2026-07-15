"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, SmilePlus, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    setLoading(false)

    if (authError) {
      setError("Erro ao enviar e-mail. Verifique o endereço e tente novamente.")
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">E-mail enviado</h1>
          <p className="text-sm text-muted-foreground">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <SmilePlus className="size-6 text-primary" />
            <span className="text-primary">Clinica</span>
            <span className="text-muted-foreground">.app</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Esqueceu a senha?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Informe seu e-mail para receber um link de redefinição.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
