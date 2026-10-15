import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { DestinationResponse } from '@easytrip/shared'
import { ApiError } from '@/lib/apiClient'

async function fetchDestination(name: string): Promise<DestinationResponse> {
  const res = await fetch(`/api/destination/${encodeURIComponent(name.trim())}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      (body as { erro?: string }).erro ?? 'Destino não encontrado.',
      res.status,
    )
  }
  return res.json()
}

export function useDestination() {
  const [data, setData] = useState<DestinationResponse | null>(null)
  const mutation = useMutation({
    mutationFn: fetchDestination,
    onSuccess: (res) => setData(res),
  })

  function search(destination: string) {
    if (!destination.trim()) return
    setData(null)
    mutation.mutate(destination)
  }

  return {
    data,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    search,
  }
}
