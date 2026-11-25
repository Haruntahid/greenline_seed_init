export type AdminRole = 'admin' | 'editor'

export interface AdminSession {
  uuid: string
  role: AdminRole
  displayName: string
  authenticatedAt: string
}
