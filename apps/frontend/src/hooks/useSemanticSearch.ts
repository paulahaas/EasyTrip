import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SemanticSearchResult } from '@easytrip/shared'
import { api } from '@/lib/apiClient'

/** Busca semântica. Como em useDestination, cada termo é uma query (sem corrida). */
export function useSemanticSearch() {
  const [term, setTerm] = useState<string | null>(null)
  const query = useQuery<SemanticSearchResult[]>({
    queryKey: ['semantic-search', term],
    queryFn: () =>
      api<SemanticSearchResult[]>(
        `/api/destination/search?q=${encodeURIComponent(term ?? '')}`,
      ),
    enabled: !!term,
    staleTime: 5 * 60_000,
    retry: false,
  })

  function search(q: string) {
    const trimmed = q.trim()
    if (trimmed) setTerm(trimmed)
  }

  function clear() {
    setTerm(null)
  }

  return {
    data: term ? (query.data ?? null) : null,
    loading: !!term && query.isFetching && !query.data,
    error: term && query.error instanceof Error ? query.error.message : null,
    search,
    clear,
  }
}
