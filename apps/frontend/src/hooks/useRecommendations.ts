import { useQuery } from '@tanstack/react-query'
import type { RecommendationItem } from '@easytrip/shared'
import { api } from '@/lib/apiClient'
import { useAuth } from '@/context/AuthContext'

export function useRecommendations() {
  const { isAuthenticated } = useAuth()
  const query = useQuery<RecommendationItem[]>({
    queryKey: ['recommendations'],
    queryFn: () => api<RecommendationItem[]>('/api/recommendations'),
    enabled: isAuthenticated,
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
  }
}
