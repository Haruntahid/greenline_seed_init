import { useEffect, useState } from 'react'
import {
  Bot,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Search,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react'
import { api } from '../../services/api'
import { toast } from '../../components/ui/Toast'
import './SmartAssistantPage.css'

interface QuickAction {
  id: string
  label: string
  response: string
}

interface AssistantConfig {
  enabled: boolean
  name: string
  welcomeMessage: string
  quickActions: QuickAction[]
}

interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  source?: string
  status: 'read' | 'unread'
  createdAt: string
}

const defaultConfig: AssistantConfig = {
  enabled: true,
  name: 'Seed Assistant',
  welcomeMessage:
    "Hello! Welcome to Green Line Seed Store. How can we help you today with our quality seeds and farming solutions?",
  quickActions: [
    {
      id: 'qa-1',
      label: 'Our Products',
      response:
        'We offer a wide collection of high-yielding Vegetable, Flower, Crop and Hybrid seeds. Explore the Products section to browse our catalog.',
    },
    {
      id: 'qa-2',
      label: 'Office & Store Location',
      response:
        'We are located at B55, Bazar Road, Savar 1340, Dhaka, Bangladesh. Feel free to visit us or call ahead!',
    },
    {
      id: 'qa-3',
      label: 'Contact & WhatsApp',
      response:
        'You can call or WhatsApp us directly at 01805917900 or email greenlineseedbd@gmail.com for fast support.',
    },
    {
      id: 'qa-4',
      label: 'Business Hours',
      response:
        'Our store is open Saturday through Thursday from 9:00 AM to 7:00 PM. We are closed on Fridays.',
    },
  ],
}

function SmartAssistantPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'inquiries'>('settings')

  // Config State
  const [config, setConfig] = useState<AssistantConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null)

  const loadConfig = async () => {
    setIsLoading(true)
    try {
      const res = await api.assistant.get()
      if (res?.success && res?.data) {
        setConfig({
          enabled: typeof res.data.enabled === 'boolean' ? res.data.enabled : true,
          name: res.data.name || defaultConfig.name,
          welcomeMessage: res.data.welcomeMessage || defaultConfig.welcomeMessage,
          quickActions: Array.isArray(res.data.quickActions) && res.data.quickActions.length > 0
            ? res.data.quickActions
            : defaultConfig.quickActions,
        })
      }
    } catch (err) {
      toast.error('Failed to load assistant configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const loadInquiries = async () => {
    setIsLoadingInquiries(true)
    try {
      const res = await api.contact.getMessages()
      if (res?.success && Array.isArray(res.data)) {
        setInquiries(res.data)
      }
    } catch (err) {
      toast.error('Failed to load inquiries')
    } finally {
      setIsLoadingInquiries(false)
    }
  }

  useEffect(() => {
    void loadConfig()
    void loadInquiries()
  }, [])

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    try {
      const res = await api.assistant.update(config)
      setFeedback({ type: 'success', message: res.message || 'Assistant configuration updated!' })
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save configuration.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddAction = () => {
    setConfig((prev) => ({
      ...prev,
      quickActions: [
        ...prev.quickActions,
        {
          id: `qa-${Date.now()}`,
          label: 'New Question / Topic',
          response: 'Enter the answer that the assistant should respond with.',
        },
      ],
    }))
  }

  const handleUpdateAction = (id: string, field: 'label' | 'response', value: string) => {
    setConfig((prev) => ({
      ...prev,
      quickActions: prev.quickActions.map((qa) =>
        qa.id === id ? { ...qa, [field]: value } : qa
      ),
    }))
  }

  const handleDeleteAction = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      quickActions: prev.quickActions.filter((qa) => qa.id !== id),
    }))
  }

  // Inquiry actions
  const handleToggleStatus = async (id: string, currentStatus: 'read' | 'unread') => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread'
    try {
      await api.contact.updateMessageStatus(id, newStatus)
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      )
    } catch (err: any) {
      window.alert(err.message || 'Failed to update status')
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.contact.deleteMessage(id)
      setInquiries((prev) => prev.filter((item) => item.id !== id))
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete message')
    }
  }

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone)
    setCopiedPhoneId(id)
    setTimeout(() => setCopiedPhoneId(null), 2000)
  }

  // Action: Open Gmail in new tab
  const handleOpenGmail = (inquiry: ContactInquiry) => {
    const recipient = inquiry.email ? encodeURIComponent(inquiry.email) : ''
    const subject = encodeURIComponent(`Regarding your inquiry at Green Line Seed Store`)
    const body = encodeURIComponent(
      `Hello ${inquiry.name || 'Customer'},\n\nThank you for contacting Green Line Seed Store.\n\nIn response to your inquiry:\n"${inquiry.message}"\n\n\n\nBest regards,\nGreen Line Seed Store\nPhone: 01805917900\nWebsite: greenlineseed.com`
    )
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`
    window.open(gmailUrl, '_blank')
    if (inquiry.status === 'unread') {
      void handleToggleStatus(inquiry.id, 'unread')
    }
  }

  // Action: Open SMS
  const handleOpenSMS = (inquiry: ContactInquiry) => {
    const cleanPhone = inquiry.phone.replace(/[^0-9+]/g, '')
    const body = encodeURIComponent(
      `Hello ${inquiry.name || ''}, regarding your Green Line Seed inquiry: `
    )
    const smsUrl = `sms:${cleanPhone}?body=${body}`
    window.open(smsUrl, '_blank')
    if (inquiry.status === 'unread') {
      void handleToggleStatus(inquiry.id, 'unread')
    }
  }

  // Action: Open WhatsApp
  const handleOpenWhatsApp = (inquiry: ContactInquiry) => {
    let cleanPhone = inquiry.phone.replace(/[^0-9]/g, '')
    if (cleanPhone.startsWith('01')) {
      cleanPhone = '88' + cleanPhone
    }
    const text = encodeURIComponent(
      `Hello ${inquiry.name || ''}, regarding your Green Line Seed inquiry: `
    )
    const waUrl = `https://wa.me/${cleanPhone}?text=${text}`
    window.open(waUrl, '_blank')
    if (inquiry.status === 'unread') {
      void handleToggleStatus(inquiry.id, 'unread')
    }
  }

  const unreadCount = inquiries.filter((item) => item.status === 'unread').length

  const filteredInquiries = inquiries.filter((item) => {
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter

    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)

    return matchesStatus && matchesQuery
  })

  return (
    <div className="assistant-page">
      <div className="assistant-heading">
        <div>
          <span className="assistant-eyebrow">AUTOMATION & BOT</span>
          <h1>Smart Assistant & Inquiries</h1>
          <p>Configure the floating visitor assistant and manage live messages received from customers.</p>
        </div>
      </div>

      {feedback && (
        <div className={`assistant-alert ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="assistant-tabs-bar">
        <button
          type="button"
          className={`assistant-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Bot size={16} />
          <span>Assistant Configuration</span>
        </button>

        <button
          type="button"
          className={`assistant-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          <MessageSquare size={16} />
          <span>Customer Inquiries & Messages</span>
          {unreadCount > 0 && <span className="assistant-unread-badge">{unreadCount}</span>}
        </button>
      </div>

      {/* TAB 1: CONFIGURATION */}
      {activeTab === 'settings' && (
        isLoading ? (
          <p className="assistant-loading">Loading assistant configuration...</p>
        ) : (
          <form onSubmit={handleSaveConfig} className="assistant-form-layout">
            {/* GENERAL SETTINGS */}
            <div className="assistant-card">
              <div className="assistant-card-header">
                <Bot size={20} className="assistant-card-icon" />
                <div>
                  <h2>General Settings</h2>
                  <p>Assistant identity and availability on public pages</p>
                </div>
              </div>

              <div className="assistant-fields-group">
                <label className="assistant-toggle-label">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                  />
                  <span>Enable floating chat assistant on website</span>
                </label>

                <div className="assistant-form-field">
                  <label htmlFor="assistant-name">Assistant Display Name</label>
                  <input
                    id="assistant-name"
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="assistant-form-field">
                  <label htmlFor="welcome-msg">Welcome / Greeting Message</label>
                  <textarea
                    id="welcome-msg"
                    rows={3}
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS / AUTOMATED RESPONSES */}
            <div className="assistant-card">
              <div className="assistant-card-header action-header-split">
                <div className="action-header-title">
                  <HelpCircle size={20} className="assistant-card-icon" />
                  <div>
                    <h2>Quick Actions & Automated Responses</h2>
                    <p>Pre-configured buttons visitors can click for instant answers</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="assistant-add-action-btn"
                  onClick={handleAddAction}
                >
                  <Plus size={16} /> Add Quick Action
                </button>
              </div>

              <div className="assistant-actions-list">
                {config.quickActions.map((qa, index) => (
                  <div className="assistant-action-item" key={qa.id || index}>
                    <div className="action-item-header">
                      <span className="action-item-index">#{index + 1}</span>
                      <button
                        type="button"
                        className="action-item-delete"
                        onClick={() => handleDeleteAction(qa.id)}
                        title="Delete action"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="action-item-inputs">
                      <div className="assistant-form-field">
                        <label>Button Label (Question / Topic)</label>
                        <input
                          type="text"
                          value={qa.label}
                          onChange={(e) => handleUpdateAction(qa.id, 'label', e.target.value)}
                          placeholder="e.g. Return Policy"
                          required
                        />
                      </div>

                      <div className="assistant-form-field">
                        <label>Bot Answer / Response</label>
                        <textarea
                          rows={2}
                          value={qa.response}
                          onChange={(e) => handleUpdateAction(qa.id, 'response', e.target.value)}
                          placeholder="Response provided by assistant..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="assistant-footer-actions">
                <button
                  type="submit"
                  className="assistant-save-btn"
                  disabled={isSaving}
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save Assistant Settings'}
                </button>
              </div>
            </div>
          </form>
        )
      )}

      {/* TAB 2: INQUIRIES & MESSAGES */}
      {activeTab === 'inquiries' && (
        <div className="assistant-inquiries-container">
          <div className="assistant-inquiries-toolbar">
            <div className="assistant-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by customer name, phone, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="assistant-filter-pills">
              <button
                type="button"
                className={`assistant-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({inquiries.length})
              </button>
              <button
                type="button"
                className={`assistant-pill ${statusFilter === 'unread' ? 'active' : ''}`}
                onClick={() => setStatusFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
              <button
                type="button"
                className={`assistant-pill ${statusFilter === 'read' ? 'active' : ''}`}
                onClick={() => setStatusFilter('read')}
              >
                Read / Replied ({inquiries.length - unreadCount})
              </button>
              <button
                type="button"
                className="assistant-refresh-btn"
                onClick={loadInquiries}
                title="Refresh messages"
              >
                <RotateCcw size={14} /> Refresh
              </button>
            </div>
          </div>

          {isLoadingInquiries ? (
            <p className="assistant-loading">Loading inquiries...</p>
          ) : filteredInquiries.length > 0 ? (
            <div className="assistant-inquiries-grid">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`assistant-inquiry-card ${inquiry.status === 'unread' ? 'unread' : ''}`}
                >
                  <div className="inquiry-card-header">
                    <div>
                      <h3 className="inquiry-sender-name">{inquiry.name || 'Anonymous Visitor'}</h3>
                      <span className="inquiry-timestamp">
                        {new Date(inquiry.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <div className="inquiry-badges">
                      <span className="inquiry-source-badge">
                        {inquiry.source || 'Website'}
                      </span>
                      <button
                        type="button"
                        className={`inquiry-status-toggle ${inquiry.status}`}
                        onClick={() => handleToggleStatus(inquiry.id, inquiry.status)}
                        title="Click to toggle read status"
                      >
                        {inquiry.status === 'unread' ? 'Unread' : 'Read'}
                      </button>
                    </div>
                  </div>

                  {/* BD Phone Field Display */}
                  <div className="inquiry-contact-details">
                    {inquiry.phone && (
                      <div className="inquiry-phone-row">
                        <span className="inquiry-flag-badge">🇧🇩 BD Phone:</span>
                        <strong className="inquiry-phone-number">{inquiry.phone}</strong>
                        <button
                          type="button"
                          className="inquiry-copy-btn"
                          onClick={() => handleCopyPhone(inquiry.id, inquiry.phone)}
                          title="Copy phone number"
                        >
                          {copiedPhoneId === inquiry.id ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}

                    {inquiry.email && (
                      <div className="inquiry-email-row">
                        <Mail size={13} />
                        <span>{inquiry.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="inquiry-message-box">
                    <p>{inquiry.message}</p>
                  </div>

                  {/* DIRECT REPLY & CONTACT ACTIONS */}
                  <div className="inquiry-actions-bar">
                    <div className="inquiry-reply-buttons">
                      <button
                        type="button"
                        className="inquiry-action-btn gmail"
                        onClick={() => handleOpenGmail(inquiry)}
                        title="Open Gmail compose in a new tab"
                      >
                        <Mail size={14} />
                        <span>Reply on Gmail</span>
                        <ExternalLink size={12} />
                      </button>

                      {inquiry.phone && (
                        <>
                          <button
                            type="button"
                            className="inquiry-action-btn sms"
                            onClick={() => handleOpenSMS(inquiry)}
                            title="Send SMS to customer"
                          >
                            <Phone size={14} />
                            <span>Send SMS</span>
                          </button>

                          <button
                            type="button"
                            className="inquiry-action-btn whatsapp"
                            onClick={() => handleOpenWhatsApp(inquiry)}
                            title="Message on WhatsApp"
                          >
                            <MessageSquare size={14} />
                            <span>WhatsApp</span>
                            <ExternalLink size={12} />
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className="inquiry-delete-btn"
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      title="Delete inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="assistant-inquiries-empty">
              <MessageSquare size={36} />
              <h3>No inquiries found</h3>
              <p>When visitors send messages or leave BD phone numbers, they will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SmartAssistantPage
