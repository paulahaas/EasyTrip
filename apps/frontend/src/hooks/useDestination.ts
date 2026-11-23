import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { DestinationResponse } from '@easytrip/shared'
import { api } from '@/lib/apiClient'

/**
 * Detalhes de um país. Cada nome é uma query própria: se a pessoa abrir dois
 * países em sequência, a resposta atrasada do primeiro não sobrescreve o segundo.
 */
export function useDestination() {
  const [name, setName] = useState<string | null>(null)
  const query = useQuery<DestinationResponse>({
    queryKey: ['destination', name],
    queryFn: () =>
      api<DestinationResponse>(`/api/destination/${encodeURIComponent(name ?? '')}`),
    enabled: !!name,
    staleTime: 5 * 60_000,
    retry: false,
  })

  function search(destination: string) {
    const trimmed = destination.trim()
    if (trimmed) setName(trimmed)
  }

  function clear() {
    setName(null)
  }

  return {
    data: name ? (query.data ?? null) : null,
    loading: !!name && query.isFetching && !query.data,
    error: name && query.error instanceof Error ? query.error.message : null,
    search,
    clear,
  }
}
