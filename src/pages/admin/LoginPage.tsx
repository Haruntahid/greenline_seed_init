import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [uuid, setUuid] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    '/admin'

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(uuid.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid UUID or password. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-background">
        <div className="admin-login-glow admin-login-glow-one" />
        <div className="admin-login-glow admin-login-glow-two" />
        <div className="admin-login-grid" />
      </div>

      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-brand-icon">
            G
          </div>

          <div>
            <h2>GREENLINE</h2>
            <span>SEED MANAGEMENT</span>
          </div>
        </div>

        <div className="admin-login-heading">
          <div className="admin-login-shield">
            <ShieldCheck size={23} />
          </div>

          <span className="admin-login-eyebrow">
            SECURE ADMIN ACCESS
          </span>

          <h1>Welcome back</h1>

          <p>
            Sign in to access your website management workspace.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="admin-login-field">
            <label htmlFor="admin-uuid">UUID</label>

            <div className="admin-login-input-wrapper">
              <UserRound size={18} />

              <input
                id="admin-uuid"
                type="text"
                placeholder="Enter your UUID"
                value={uuid}
                onChange={(event) => setUuid(event.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-login-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-login-password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="admin-login-footer">
          <LockKeyhole size={13} />
          <span>Authorized personnel only</span>
        </div>
      </div>

      <div className="admin-login-copyright">
        MASTER WEBSITE TEMPLATE · ADMIN PORTAL
      </div>
    </div>
  )
}

export default LoginPage
