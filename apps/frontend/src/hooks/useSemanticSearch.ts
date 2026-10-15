import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { SemanticSearchResult } from '@easytrip/shared'
import { ApiError } from '@/lib/apiClient'

async function fetchSemanticSearch(query: string): Promise<SemanticSearchResult[]> {
  const res = await fetch(
    `/api/destination/search?q=${encodeURIComponent(query.trim())}`,
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      (body as { erro?: string }).erro ?? 'Erro na busca semântica.',
      res.status,
    )
  }
  return res.json()
}

export function useSemanticSearch() {
  const [data, setData] = useState<SemanticSearchResult[] | null>(null)
  const mutation = useMutation({
    mutationFn: fetchSemanticSearch,
    onSuccess: (res) => setData(res),
  })

  function search(query: string) {
    if (!query.trim()) return
    setData(null)
    mutation.mutate(query)
  }

  function clear() {
    setData(null)
  }

  return {
    data,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    search,
    clear,
  }
}
