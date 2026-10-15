import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { WishlistItem } from '@easytrip/shared'
import { api } from '@/lib/apiClient'
import { useAuth } from '@/context/AuthContext'

interface AddInput {
  cca2: string
  countryName: string
  continent: string
}

export function useWishlist() {
  const { isAuthenticated } = useAuth()
  const qc = useQueryClient()

  const query = useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: () => api<WishlistItem[]>('/api/wishlist'),
    enabled: isAuthenticated,
  })

  const addMut = useMutation({
    mutationFn: (input: AddInput) =>
      api<WishlistItem>('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({
          cca2: input.cca2.toUpperCase(),
          countryName: input.countryName,
          continent: input.continent,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  const removeMut = useMutation({
    mutationFn: (cca2: string) =>
      api(`/api/wishlist/${cca2.toUpperCase()}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    add: (input: AddInput) => addMut.mutateAsync(input),
    remove: (cca2: string) => removeMut.mutateAsync(cca2),
  }
}
