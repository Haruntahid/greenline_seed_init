import type { AdminSession } from '../auth/auth.config'
import { api, setAuthToken } from './api'

export async function loginAdmin(
  uuid: string,
  password: string,
): Promise<AdminSession> {
  const response = await api.auth.login(uuid, password)
  if (!response.success || !response.user) {
    throw new Error('Authentication failed.')
  }
  if (response.token) {
    setAuthToken(response.token)
  }
  return response.user
}

export async function verifyAdminSession(): Promise<AdminSession | null> {
  try {
    const response = await api.auth.me()
    if (response.success && response.user) {
      return response.user
    }
    return null
  } catch {
    setAuthToken(null)
    return null
  }
}

export async function refreshAdminSession(): Promise<AdminSession | null> {
  try {
    const response = await api.auth.refresh()
    if (response.success && response.user) {
      if (response.token) {
        setAuthToken(response.token)
      }
      return response.user
    }
    return null
  } catch {
    setAuthToken(null)
    return null
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await api.auth.logout()
  } finally {
    setAuthToken(null)
  }
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await api.auth.changePassword(currentPassword, newPassword)
}
