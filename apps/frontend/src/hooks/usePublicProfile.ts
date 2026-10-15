import { useQuery } from '@tanstack/react-query'
import type { PublicProfile } from '@easytrip/shared'
import { api } from '@/lib/apiClient'
import { useAuth } from '@/context/AuthContext'

export function usePublicProfile(id: string | undefined) {
  const { isAuthenticated } = useAuth()
  const query = useQuery<PublicProfile>({
    queryKey: ['profile', id],
    queryFn: () => api<PublicProfile>(`/api/users/${id}/profile`),
    enabled: isAuthenticated && !!id,
  })
  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}
