import { useQuery } from '@tanstack/react-query'
import type { StatsResponse } from '@easytrip/shared'
import { api } from '@/lib/apiClient'
import { useAuth } from '@/context/AuthContext'

export function useContinentStats() {
  const { isAuthenticated } = useAuth()
  const query = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () => api<StatsResponse>('/api/stats/continents'),
    enabled: isAuthenticated,
  })

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
  }
}
