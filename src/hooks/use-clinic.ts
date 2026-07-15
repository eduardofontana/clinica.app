"use client"

import { useState, useEffect, useCallback } from "react"

export interface Clinic {
  id: string
  name: string
  slug: string
  logo_url?: string | null
  banner_url?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  description?: string | null
  whatsapp_number?: string | null
}

interface UseClinicReturn {
  clinic: Clinic | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

function useClinic(clinicId?: string): UseClinicReturn {
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClinic = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = clinicId
        ? `/api/clinics/${clinicId}`
        : `/api/clinics/current`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Falha ao carregar dados da clínica")
      }

      const data = await response.json()
      setClinic(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro desconhecido ao carregar clínica"
      )
    } finally {
      setIsLoading(false)
    }
  }, [clinicId])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const url = clinicId
          ? `/api/clinics/${clinicId}`
          : `/api/clinics/current`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Falha ao carregar dados da clínica")
        }

        const data = await response.json()
        if (!cancelled) {
          setClinic(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Erro desconhecido ao carregar clínica"
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [clinicId])

  return { clinic, isLoading, error, refetch: fetchClinic }
}

export { useClinic }
