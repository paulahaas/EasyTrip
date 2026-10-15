import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  User,
} from '@easytrip/shared'
import { api, clearToken, getToken, setToken } from '@/lib/apiClient'

const LOCAL_HISTORY_KEY = 'easytrip:search-history'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (input: LoginDTO) => Promise<void>
  register: (input: RegisterDTO) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [loading, setLoading] = useState<boolean>(true)
  const qc = useQueryClient()

  const handleLogout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
    qc.clear()
  }, [qc])

  useEffect(() => {
    async function hydrate() {
      const existing = getToken()
      if (!existing) {
        setLoading(false)
        return
      }
      try {
        const me = await api<User>('/api/auth/me')
        setUser(me)
        setTokenState(existing)
      } catch {
        handleLogout()
      } finally {
        setLoading(false)
      }
    }
    hydrate()
  }, [handleLogout])

  useEffect(() => {
    function onExternalLogout() {
      setUser(null)
      setTokenState(null)
    }
    window.addEventListener('auth:logout', onExternalLogout)
    return () => window.removeEventListener('auth:logout', onExternalLogout)
  }, [])

  const migrateLocalHistory = useCallback(async () => {
    let queries: string[] = []
    try {
      queries = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) ?? '[]')
    } catch {
      queries = []
    }
    if (!Array.isArray(queries) || queries.length === 0) return
    try {
      await api('/api/history/bulk', {
        method: 'POST',
        body: JSON.stringify({ queries }),
      })
      localStorage.removeItem(LOCAL_HISTORY_KEY)
    } catch {
      // best effort
    }
  }, [])

  const applyAuth = useCallback(
    async (res: AuthResponse) => {
      setToken(res.tokens.accessToken)
      setTokenState(res.tokens.accessToken)
      setUser(res.user)
      await migrateLocalHistory()
      qc.invalidateQueries()
    },
    [migrateLocalHistory, qc],
  )

  const login = useCallback(
    async (input: LoginDTO) => {
      const res = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      await applyAuth(res)
    },
    [applyAuth],
  )

  const register = useCallback(
    async (input: RegisterDTO) => {
      const res = await api<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      await applyAuth(res)
    },
    [applyAuth],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      loading,
      login,
      register,
      logout: handleLogout,
    }),
    [user, token, loading, login, register, handleLogout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider')
  return ctx
}
