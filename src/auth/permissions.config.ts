
import type { AdminRole } from './auth.config'

export type AdminModule =
  | 'dashboard'
  | 'websiteContent'
  | 'products'
  | 'mediaLibrary'
  | 'smartAssistant'
  | 'themeAppearance'
  | 'siteSettings'
  | 'security'

export const rolePermissions: Record<AdminRole, AdminModule[]> = {
  admin: [
    'dashboard',
    'websiteContent',
    'products',
    'mediaLibrary',
    'smartAssistant',
    'themeAppearance',
    'siteSettings',
    'security',
  ],

  editor: [
    'dashboard',
    'websiteContent',
    'products',
    'mediaLibrary',
    'smartAssistant',
  ],
}

export const hasPermission = (
  role: AdminRole,
  module: AdminModule,
): boolean => {
  return rolePermissions[role].includes(module)
}
