import { useEffect, useState } from 'react'
import {
  UserPlus,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../auth/AuthContext'
import './SecurityPage.css'

interface AdminUserItem {
  uuid: string
  displayName: string
  role: 'admin' | 'editor'
  active: boolean
  createdAt?: string
  lastLoginAt?: string
}

function SecurityPage() {
  const { session } = useAuth()
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // New user form state
  const [newUuid, setNewUuid] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('admin')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newSelfPassword, setNewSelfPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const loadUsers = async () => {
    if (session?.role !== 'admin') return
    setIsLoading(true)
    setErrorMsg('')
    try {
      const res = await api.auth.listUsers()
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load admin users.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [session?.role])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!newUuid.trim() || !newDisplayName.trim() || !newPassword) {
      setErrorMsg('All fields are required.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.auth.createUser({
        uuid: newUuid.trim(),
        displayName: newDisplayName.trim(),
        password: newPassword,
        role: newRole,
      })
      setSuccessMsg(res.message || 'Admin user created successfully!')
      setNewUuid('')
      setNewDisplayName('')
      setNewPassword('')
      await loadUsers()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (uuid: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${uuid}"?`)) {
      return
    }
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await api.auth.deleteUser(uuid)
      setSuccessMsg(res.message || `User "${uuid}" deleted successfully.`)
      await loadUsers()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete user.')
    }
  }

  const handleChangeSelfPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordStatus(null)

    if (!currentPassword || !newSelfPassword) {
      setPasswordStatus({ type: 'error', message: 'Current and new password are required.' })
      return
    }

    if (newSelfPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
      return
    }

    if (newSelfPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    setIsChangingPassword(true)
    try {
      const res = await api.auth.changePassword(currentPassword, newSelfPassword)
      setPasswordStatus({ type: 'success', message: res.message || 'Password updated successfully!' })
      setCurrentPassword('')
      setNewSelfPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to change password.' })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="security-page">
      <div className="security-page-heading">
        <div>
          <span className="security-page-eyebrow">ADMINISTRATION & SECURITY</span>
          <h1>Security & User Management</h1>
          <p>Create administrators, manage editor accounts, and update your security credentials.</p>
        </div>
      </div>

      <div className="security-grid">
        {/* CREATE NEW ADMIN/USER (Only for Admin role) */}
        {session?.role === 'admin' && (
          <div className="security-card">
            <div className="security-card-header">
              <UserPlus size={20} className="security-icon" />
              <div>
                <h2>Create New Administrator / Editor</h2>
                <p>Grant admin or editor access to a team member</p>
              </div>
            </div>

            {errorMsg && (
              <div className="security-alert error">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="security-alert success">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="security-form">
              <div className="security-form-group">
                <label htmlFor="new-uuid">Username / UUID</label>
                <input
                  id="new-uuid"
                  type="text"
                  placeholder="e.g. jdoe or admin2"
                  value={newUuid}
                  onChange={(e) => setNewUuid(e.target.value)}
                  required
                />
              </div>

              <div className="security-form-group">
                <label htmlFor="new-name">Full / Display Name</label>
                <input
                  id="new-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className="security-form-group">
                <label htmlFor="new-role">Account Role</label>
                <select
                  id="new-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'editor')}
                >
                  <option value="admin">Administrator (Full Control)</option>
                  <option value="editor">Content Editor (Catalog & Content only)</option>
                </select>
              </div>

              <div className="security-form-group">
                <label htmlFor="new-password">Password (min 6 characters)</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="security-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating User...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        {/* CHANGE CURRENT PASSWORD */}
        <div className="security-card">
          <div className="security-card-header">
            <KeyRound size={20} className="security-icon" />
            <div>
              <h2>Change Password</h2>
              <p>Update credentials for {session?.displayName} ({session?.uuid})</p>
            </div>
          </div>

          {passwordStatus && (
            <div className={`security-alert ${passwordStatus.type}`}>
              {passwordStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleChangeSelfPassword} className="security-form">
            <div className="security-form-group">
              <label htmlFor="curr-password">Current Password</label>
              <input
                id="curr-password"
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="security-form-group">
              <label htmlFor="new-self-password">New Password</label>
              <input
                id="new-self-password"
                type="password"
                placeholder="New password (min 6 characters)"
                value={newSelfPassword}
                onChange={(e) => setNewSelfPassword(e.target.value)}
                required
              />
            </div>

            <div className="security-form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="security-submit-btn"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* ADMIN USERS LIST */}
      {session?.role === 'admin' && (
        <div className="security-card users-list-card">
          <div className="security-card-header">
            <Users size={20} className="security-icon" />
            <div>
              <h2>Active Admin & Editor Users</h2>
              <p>Accounts with access to the GreenLine Seed administration panel</p>
            </div>
          </div>

          {isLoading ? (
            <p className="security-loading">Loading users...</p>
          ) : (
            <div className="security-table-wrapper">
              <table className="security-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Display Name</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.uuid === session?.uuid
                    return (
                      <tr key={u.uuid}>
                        <td>
                          <strong>{u.uuid}</strong>
                          {isSelf && <span className="self-badge">You</span>}
                        </td>
                        <td>{u.displayName}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role === 'admin' ? 'Administrator' : 'Editor'}
                          </span>
                        </td>
                        <td>
                          {u.lastLoginAt
                            ? new Date(u.lastLoginAt).toLocaleString()
                            : 'Never'}
                        </td>
                        <td>
                          {isSelf ? (
                            <span className="text-muted">Active (Self)</span>
                          ) : (
                            <button
                              type="button"
                              className="security-delete-btn"
                              onClick={() => handleDeleteUser(u.uuid)}
                              title={`Delete ${u.uuid}`}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SecurityPage
