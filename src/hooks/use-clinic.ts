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
    try {
      setIsLoading(true)
      setError(null)

      // If no clinicId is provided, try to fetch from the current session context
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
    fetchClinic()
  }, [fetchClinic])

  return { clinic, isLoading, error, refetch: fetchClinic }
}

export { useClinic }
