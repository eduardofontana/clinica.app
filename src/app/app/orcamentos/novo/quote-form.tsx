"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

/* ─── Types ─────────────────────────────────────────────────────── */

interface PatientOption {
  id: string
  name: string
}

interface ProfessionalOption {
  id: string
  name: string
  specialty: string | null
}

interface ServiceOption {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  base_price: number | null
}

interface QuoteItem {
  id: string
  name: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

interface QuoteFormProps {
  patients: PatientOption[]
  professionals: ProfessionalOption[]
  services: ServiceOption[]
}

/* ─── Helpers ───────────────────────────────────────────────────── */

let itemCounter = 0
function generateItemId() {
  itemCounter += 1
  return `item_${itemCounter}_${Date.now()}`
}

function calculateTotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + item.total_price, 0)
}

function parseCurrencyInput(value: string): number {
  // Accept "1.234,56" (Brazilian) or "1234.56" (dot)
  const cleaned = value
    .replace(/\./g, "") // remove thousand separators (dots)
    .replace(",", ".") // convert decimal comma to dot
    .replace(/[^0-9.]/g, "") // remove any non-numeric except dot

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/* ─── Quote Form Component ─────────────────────────────────────── */

function QuoteForm({ patients, professionals, services }: QuoteFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [patientId, setPatientId] = useState("")
  const [professionalId, setProfessionalId] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [items, setItems] = useState<QuoteItem[]>([])

  // New item form fields
  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [customItemName, setCustomItemName] = useState("")
  const [customItemDescription, setCustomItemDescription] = useState("")
  const [customItemPrice, setCustomItemPrice] = useState("")
  const [customItemQuantity, setCustomItemQuantity] = useState("1")

  const totalAmount = calculateTotal(items)

  /* ─── Add service as quote item ───────────────────────────────── */
  const handleAddService = useCallback(() => {
    if (!selectedServiceId) {
      toast.error("Selecione um serviço para adicionar.")
      return
    }

    const service = services.find((s) => s.id === selectedServiceId)
    if (!service) return

    const qty = parseInt(customItemQuantity, 10) || 1
    const unitPrice = service.base_price ?? 0

    setItems((prev) => [
      ...prev,
      {
        id: generateItemId(),
        name: service.name,
        description: service.description ?? "",
        quantity: qty,
        unit_price: unitPrice,
        total_price: unitPrice * qty,
      },
    ])

    setSelectedServiceId("")
    setCustomItemQuantity("1")
  }, [selectedServiceId, customItemQuantity, services])

  /* ─── Add custom quote item ───────────────────────────────────── */
  const handleAddCustomItem = useCallback(() => {
    const name = customItemName.trim()
    if (!name) {
      toast.error("Informe o nome do item personalizado.")
      return
    }

    const qty = parseInt(customItemQuantity, 10) || 1
    const unitPrice = parseCurrencyInput(customItemPrice)

    setItems((prev) => [
      ...prev,
      {
        id: generateItemId(),
        name,
        description: customItemDescription.trim(),
        quantity: qty,
        unit_price: unitPrice,
        total_price: unitPrice * qty,
      },
    ])

    setCustomItemName("")
    setCustomItemDescription("")
    setCustomItemPrice("")
    setCustomItemQuantity("1")
  }, [customItemName, customItemDescription, customItemPrice, customItemQuantity])

  /* ─── Remove quote item ───────────────────────────────────────── */
  const handleRemoveItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  /* ─── Update item quantity ────────────────────────────────────── */
  const handleQuantityChange = useCallback(
    (itemId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                total_price: item.unit_price * quantity,
              }
            : item,
        ),
      )
    },
    [],
  )

  /* ─── Update item unit price ──────────────────────────────────── */
  const handleUnitPriceChange = useCallback(
    (itemId: string, unitPrice: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                unit_price: unitPrice,
                total_price: unitPrice * item.quantity,
              }
            : item,
        ),
      )
    },
    [],
  )

  /* ─── Submit form (save draft or send) ────────────────────────── */
  const handleSubmit = useCallback(
    async (status: "draft" | "sent") => {
      if (!title.trim()) {
        toast.error("O título do orçamento é obrigatório.")
        return
      }

      if (!patientId) {
        toast.error("Selecione um paciente.")
        return
      }

      if (items.length === 0) {
        toast.error("Adicione pelo menos um item ao orçamento.")
        return
      }

      if (totalAmount <= 0) {
        toast.error("O valor total do orçamento deve ser maior que zero.")
        return
      }

      startTransition(async () => {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          toast.error("Você precisa estar autenticado.")
          return
        }

        let clinicId = user.app_metadata?.clinic_id as string | undefined

        if (!clinicId) {
          const { data: member } = await supabase
            .from("clinic_members")
            .select("clinic_id")
            .eq("user_id", user.id)
            .maybeSingle()

          clinicId = member?.clinic_id
        }

        if (!clinicId) {
          toast.error("Nenhuma clínica encontrada para o usuário.")
          return
        }

        // Insert quote
        const { data: quote, error: quoteError } = await supabase
          .from("quotes")
          .insert({
            clinic_id: clinicId,
            patient_id: patientId,
            professional_id: professionalId || null,
            title: title.trim(),
            description: description.trim() || null,
            total_amount: totalAmount,
            payment_terms: paymentTerms.trim() || null,
            status,
          })
          .select("id")
          .single()

        if (quoteError) {
          console.error("Erro ao criar orçamento:", quoteError.message)
          toast.error("Erro ao criar orçamento")
          return
        }

        // Insert quote items
        const itemsToInsert = items.map((item) => ({
          quote_id: quote.id,
          name: item.name,
          description: item.description || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        }))

        const { error: itemsError } = await supabase
          .from("quote_items")
          .insert(itemsToInsert)

        if (itemsError) {
          console.error("Erro ao salvar itens do orçamento:", itemsError.message)
          toast.error("Erro ao salvar itens do orçamento")
          return
        }

        toast.success(
          status === "draft"
            ? "Orçamento salvo como rascunho!"
            : "Orçamento enviado com sucesso!",
        )

        router.push(`/app/orcamentos/${quote.id}`)
      })
    },
    [
      title,
      patientId,
      professionalId,
      description,
      paymentTerms,
      items,
      totalAmount,
      router,
    ],
  )

  return (
    <div className="space-y-8">
      {/* ─── Quote Info ─────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Título do Orçamento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Tratamento de canal e restauração"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">
                  Paciente <span className="text-destructive">*</span>
                </Label>
                <Select value={patientId} onValueChange={(val: string | null) => val && setPatientId(val)}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                    {patients.length === 0 && (
                      <SelectItem value="__none__" disabled>
                        Nenhum paciente disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="professional">Profissional</Label>
                <Select
                  value={professionalId}
                  onValueChange={(val: string | null) => val && setProfessionalId(val)}
                >
                  <SelectTrigger id="professional">
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                        {p.specialty ? ` — ${p.specialty}` : ""}
                      </SelectItem>
                    ))}
                    {professionals.length === 0 && (
                      <SelectItem value="__none__" disabled>
                        Nenhum profissional disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição geral do orçamento..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment_terms">Condições de Pagamento</Label>
              <Textarea
                id="payment_terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="Ex: Entrada de R$ 200,00 + 3 parcelas de R$ 150,00"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Quote Items ────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 font-heading text-base font-medium">
            Itens do Orçamento
          </h3>

          {/* Add service */}
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <Label htmlFor="service" className="mb-1 block text-xs">
                Serviço
              </Label>
              <Select
                value={selectedServiceId}
                onValueChange={(val: string | null) => {
                  if (!val) return
                  setSelectedServiceId(val)
                  const service = services.find((s) => s.id === val)
                  if (service) {
                    setCustomItemName(service.name)
                    setCustomItemDescription(service.description ?? "")
                    setCustomItemPrice(
                      service.base_price?.toFixed(2).replace(".", ",") ?? "0,00",
                    )
                  }
                }}
              >
                <SelectTrigger id="service" className="w-full">
                  <SelectValue placeholder="Selecionar serviço..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {s.base_price
                        ? ` — ${formatCurrency(s.base_price)}`
                        : ""}
                    </SelectItem>
                  ))}
                  {services.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      Nenhum serviço disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="qty" className="mb-1 block text-xs">
                Quantidade
              </Label>
              <Input
                id="qty"
                type="number"
                min={1}
                value={customItemQuantity}
                onChange={(e) => setCustomItemQuantity(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="item-price" className="mb-1 block text-xs">
                Valor Unitário (R$)
              </Label>
              <Input
                id="item-price"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div className="flex items-end sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAddService}
              >
                <Plus className="size-4" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Items table */}
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Item</TableHead>
                    <TableHead className="w-[12%] text-center">
                      Qtd
                    </TableHead>
                    <TableHead className="w-[18%] text-right">
                      Valor Unit.
                    </TableHead>
                    <TableHead className="w-[18%] text-right">
                      Subtotal
                    </TableHead>
                    <TableHead className="w-[12%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value, 10) || 1,
                            )
                          }
                          className="h-7 w-16 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="text"
                          value={formatCurrency(item.unit_price)}
                          onChange={(e) => {
                            const val = parseCurrencyInput(e.target.value)
                            handleUnitPriceChange(item.id, val)
                          }}
                          className="h-7 w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total_price)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum item adicionado. Selecione um serviço acima ou adicione
                manualmente.
              </p>
            </div>
          )}

          {/* Manual item add */}
          <Separator className="my-4" />

          <details className="group">
            <summary className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              Adicionar item personalizado
            </summary>
            <div className="mt-3 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <Label htmlFor="custom-name" className="mb-1 block text-xs">
                  Nome do Item <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="custom-name"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Ex: Aplicação de flúor"
                />
              </div>
              <div className="sm:col-span-3">
                <Label
                  htmlFor="custom-desc"
                  className="mb-1 block text-xs"
                >
                  Descrição
                </Label>
                <Input
                  id="custom-desc"
                  value={customItemDescription}
                  onChange={(e) => setCustomItemDescription(e.target.value)}
                  placeholder="Descrição opcional"
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="custom-qty"
                  className="mb-1 block text-xs"
                >
                  Quantidade
                </Label>
                <Input
                  id="custom-qty"
                  type="number"
                  min={1}
                  value={customItemQuantity}
                  onChange={(e) => setCustomItemQuantity(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="custom-price"
                  className="mb-1 block text-xs"
                >
                  Valor Unit. (R$)
                </Label>
                <Input
                  id="custom-price"
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="flex items-end sm:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleAddCustomItem}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* ─── Total and Actions ───────────────────────────────────── */}
      <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-right sm:text-left">
          <span className="text-sm text-muted-foreground">
            Total do Orçamento
          </span>
          <div className="font-heading text-2xl font-semibold">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            disabled={isPending}
            onClick={() => handleSubmit("draft")}
          >
            {isPending ? "Salvando..." : "Salvar como Rascunho"}
          </Button>
          <Button
            type="button"
            variant="default"
            size="default"
            disabled={isPending}
            onClick={() => handleSubmit("sent")}
          >
            {isPending ? "Salvando..." : "Enviar Orçamento"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { QuoteForm }
