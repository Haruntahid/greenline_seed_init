import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import './Toast.css'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

type ToastListener = (toasts: ToastItem[]) => void

let activeToasts: ToastItem[] = []
const listeners = new Set<ToastListener>()

function notifyListeners() {
  listeners.forEach((listener) => listener([...activeToasts]))
}

export const toast = {
  show(message: string, type: ToastType = 'info') {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    const newToast: ToastItem = { id, message, type }
    activeToasts = [...activeToasts, newToast]
    notifyListeners()

    setTimeout(() => {
      activeToasts = activeToasts.filter((t) => t.id !== id)
      notifyListeners()
    }, 4000)
  },
  success(message: string) {
    this.show(message, 'success')
  },
  error(message: string) {
    this.show(message, 'error')
  },
  info(message: string) {
    this.show(message, 'info')
  },
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler: ToastListener = (newToasts) => setToasts(newToasts)
    listeners.add(handler)
    return () => {
      listeners.delete(handler)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    activeToasts = activeToasts.filter((t) => t.id !== id)
    notifyListeners()
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((item) => (
        <div key={item.id} className={`toast-item toast-${item.type}`}>
          <div className="toast-icon">
            {item.type === 'success' && <CheckCircle2 size={18} />}
            {item.type === 'error' && <AlertCircle size={18} />}
            {item.type === 'info' && <Info size={18} />}
          </div>
          <div className="toast-content">{item.message}</div>
          <button
            type="button"
            className="toast-close"
            onClick={() => removeToast(item.id)}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
