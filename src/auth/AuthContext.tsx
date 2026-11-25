import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { AdminSession } from './auth.config'
import {
  loginAdmin,
  logoutAdmin,
  refreshAdminSession,
  verifyAdminSession,
} from '../services/auth.service'
import { registerUnauthorizedHandler } from '../services/api'

interface AuthContextValue {
  session: AdminSession | null
  isLoading: boolean
  login: (uuid: string, password: string) => Promise<AdminSession>
  logout: () => Promise<void>
  refreshSession: () => Promise<AdminSession | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    registerUnauthorizedHandler(() => {
      if (active) {
        setSession(null)
      }
    })

    void verifyAdminSession().then((verifiedUser) => {
      if (active) {
        setSession(verifiedUser)
        setIsLoading(false)
      }
    })

    return () => {
      active = false
      registerUnauthorizedHandler(null)
    }
  }, [])

  const login = useCallback(async (uuid: string, password: string) => {
    const user = await loginAdmin(uuid, password)
    setSession(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await logoutAdmin()
    setSession(null)
  }, [])

  const refreshSession = useCallback(async () => {
    const user = await refreshAdminSession()
    setSession(user)
    return user
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
