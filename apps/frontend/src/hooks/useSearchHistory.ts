import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SearchHistoryEntry } from '@easytrip/shared'
import { api } from '@/lib/apiClient'
import { useAuth } from '@/context/AuthContext'
import { useLocalHistory } from './useLocalHistory'

interface SearchHistoryHook {
  history: string[]
  entries: SearchHistoryEntry[]
  isLoading: boolean
  add: (query: string) => void
  clear: () => void
  removeById: (id: string) => void
}

export function useSearchHistory(): SearchHistoryHook {
  const { isAuthenticated } = useAuth()
  const local = useLocalHistory()
  const qc = useQueryClient()

  const { data: entries = [], isLoading } = useQuery<SearchHistoryEntry[]>({
    queryKey: ['history'],
    queryFn: () => api<SearchHistoryEntry[]>('/api/history'),
    enabled: isAuthenticated,
  })

  const addMut = useMutation({
    mutationFn: (query: string) =>
      api<SearchHistoryEntry>('/api/history', {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['history'] })
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  const clearMut = useMutation({
    mutationFn: () => api('/api/history', { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['history'] })
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  const removeMut = useMutation({
    mutationFn: (id: string) => api(`/api/history/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['history'] })
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  if (!isAuthenticated) {
    return {
      history: local.history,
      entries: [],
      isLoading: false,
      add: local.add,
      clear: local.clear,
      removeById: () => {},
    }
  }

  return {
    history: entries.map((e) => e.countryName),
    entries,
    isLoading,
    add: (query: string) => addMut.mutate(query),
    clear: () => clearMut.mutate(),
    removeById: (id: string) => removeMut.mutate(id),
  }
}
