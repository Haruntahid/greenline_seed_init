
import { useEffect, useState } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Clock3,
  Sparkles,
  ChevronRight,
  Bot,
  HelpCircle,
  Phone,
} from 'lucide-react'
import { api } from '../../services/api'
import './FloatingAssistant.css'

type ChatMessage = {
  id: number
  text: string
  sender: 'assistant' | 'visitor'
}

type QuickActionItem = {
  id?: string
  label: string
  response: string
}

const defaultActions: QuickActionItem[] = [
  {
    label: 'Our Products',
    response:
      'We offer a wide collection of high-yielding Vegetable, Flower, Crop and Hybrid seeds. Explore our Products section!',
  },
  {
    label: 'Office & Store Location',
    response:
      'We are located at B55, Bazar Road, Savar 1340, Dhaka, Bangladesh. Feel free to visit us or call ahead!',
  },
  {
    label: 'Contact & WhatsApp',
    response:
      'You can call or WhatsApp us directly at 01805917900 or email greenlineseedbd@gmail.com for fast support.',
  },
  {
    label: 'Business Hours',
    response:
      'Our store is open Saturday through Thursday from 9:00 AM to 7:00 PM. We are closed on Fridays.',
  },
]

function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [assistantName, setAssistantName] = useState('GreenLine Assistant')
  const [welcomeText, setWelcomeText] = useState(
    'Hello! How can we assist you with our seeds and agriculture products today?',
  )
  const [quickActionList, setQuickActionList] = useState<QuickActionItem[]>(defaultActions)
  const [isEnabled, setIsEnabled] = useState(true)

  // BD Phone Inquiry Mode
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [inquiryText, setInquiryText] = useState('')
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)
  const [inquiryError, setInquiryError] = useState('')

  useEffect(() => {
    let active = true
    api.assistant.get().then((res) => {
      if (active && res?.success && res?.data) {
        if (res.data.name) setAssistantName(res.data.name)
        if (res.data.welcomeMessage) setWelcomeText(res.data.welcomeMessage)
        if (Array.isArray(res.data.quickActions) && res.data.quickActions.length > 0) {
          setQuickActionList(res.data.quickActions)
        }
        if (typeof res.data.enabled === 'boolean') {
          setIsEnabled(res.data.enabled)
        }
      }
    }).catch(() => {
      // Use defaults
    })
    return () => {
      active = false
    }
  }, [])

  const sendMessage = (text: string) => {
    const trimmedText = text.trim()

    if (!trimmedText) return

    const visitorMessage: ChatMessage = {
      id: Date.now(),
      text: trimmedText,
      sender: 'visitor',
    }

    setMessages((previous) => [...previous, visitorMessage])
    setInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      const lower = trimmedText.toLowerCase()
      const match = quickActionList.find((qa) => {
        const qaLabel = qa.label.toLowerCase()
        return (
          qaLabel.includes(lower) ||
          lower.includes(qaLabel) ||
          (lower.includes('product') && qaLabel.includes('product')) ||
          (lower.includes('seed') && qaLabel.includes('product')) ||
          ((lower.includes('location') || lower.includes('address') || lower.includes('office') || lower.includes('where')) &&
            qaLabel.includes('location')) ||
          ((lower.includes('contact') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('call')) &&
            qaLabel.includes('contact')) ||
          ((lower.includes('hour') || lower.includes('time') || lower.includes('open') || lower.includes('close')) &&
            qaLabel.includes('hour'))
        )
      })

      const replyText = match
        ? match.response
        : "Thank you for reaching out! You can choose any of the quick topics below, or click '📱 Leave BD Phone & Message' so our support team can call or SMS you directly."

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        text: replyText,
        sender: 'assistant',
      }

      setMessages((previous) => [...previous, assistantMessage])
      setIsTyping(false)
    }, 600)
  }

  const handleQuickAction = (response: string) => {
    const visitorMessage: ChatMessage = {
      id: Date.now(),
      text: response === 'time'
        ? 'What is the current date and time?'
        : quickActionList.find((action) => action.response === response)?.label ??
          'Quick action',
      sender: 'visitor',
    }

    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      text:
        response === 'time'
          ? `Your local date and time is ${new Date().toLocaleString(undefined, {
              dateStyle: 'full',
              timeStyle: 'short',
            })}.`
          : response,
      sender: 'assistant',
    }

    setMessages((previous) => [
      ...previous,
      visitorMessage,
      assistantMessage,
    ])
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInquiryError('')

    const cleanPhone = visitorPhone.trim()
    const cleanText = inquiryText.trim()

    if (!cleanPhone) {
      setInquiryError('Please enter your phone number.')
      return
    }

    if (!cleanText) {
      setInquiryError('Please enter your message.')
      return
    }

    setIsSubmittingInquiry(true)
    try {
      await api.contact.submitMessage({
        name: visitorName.trim() || 'Website Visitor',
        email: '',
        phone: cleanPhone,
        subject: 'Smart Assistant Inquiry',
        message: cleanText,
      })

      const userMsg: ChatMessage = {
        id: Date.now(),
        text: `📱 Phone: ${cleanPhone}\n💬 Message: ${cleanText}`,
        sender: 'visitor',
      }
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        text: `Thank you! Your message and BD phone number (${cleanPhone}) have been forwarded to our team. We will call or send you an SMS shortly.`,
        sender: 'assistant',
      }
      setMessages((prev) => [...prev, userMsg, botMsg])
      setShowInquiryForm(false)
      setVisitorName('')
      setVisitorPhone('')
      setInquiryText('')
    } catch (err: any) {
      setInquiryError(err.message || 'Could not send message. Please try again.')
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  if (!isEnabled) return null

  return (
    <div className="assistant-launcher">
      {isOpen && (
        <section
          id="floating-assistant-panel"
          className="assistant-panel"
          role="dialog"
          aria-label="Smart assistant"
        >
          <header className="assistant-header">
            <div className="assistant-header-profile">
              <div className="assistant-avatar">
                <Bot size={23} />
                <span className="assistant-avatar-status" />
              </div>

              <div>
                <h3>{assistantName}</h3>
                <span className="assistant-online">
                  <span /> Online · Here to help
                </span>
              </div>
            </div>

            <button
              type="button"
              className="assistant-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={20} />
            </button>
          </header>

          <div className="assistant-chat-body">
            <div className="assistant-date-label">WELCOME</div>

            <div className="assistant-welcome">
              <div className="assistant-message-avatar">
                <Sparkles size={16} />
              </div>

              <div className="assistant-message assistant-message-bot">
                <h4>Hello there! 👋</h4>
                <p>{welcomeText}</p>
                <span className="assistant-message-time">Just now</span>
              </div>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`assistant-message-row ${
                  message.sender === 'visitor'
                    ? 'assistant-message-row-visitor'
                    : ''
                }`}
              >
                <div
                  className={`assistant-message ${
                    message.sender === 'visitor'
                      ? 'assistant-message-user'
                      : 'assistant-message-bot'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="assistant-message-time">
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="assistant-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            )}

            {showInquiryForm ? (
              <div className="assistant-inquiry-box">
                <div className="assistant-inquiry-box-header">
                  <h4>📱 Send Inquiry & BD Number</h4>
                  <button
                    type="button"
                    className="assistant-inquiry-close"
                    onClick={() => setShowInquiryForm(false)}
                    aria-label="Close inquiry form"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleInquirySubmit} className="assistant-inquiry-form">
                  {inquiryError && <p className="assistant-inquiry-error">{inquiryError}</p>}

                  <label>
                    Your Name (Optional)
                    <input
                      type="text"
                      placeholder="e.g. Rafiqul Islam"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                    />
                  </label>

                  <label>
                    🇧🇩 BD Phone Number *
                    <input
                      type="tel"
                      placeholder="01805917900"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Your Message / Question *
                    <textarea
                      rows={2}
                      placeholder="Ask about seeds, prices, availability..."
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      required
                    />
                  </label>

                  <div className="assistant-inquiry-btns">
                    <button
                      type="button"
                      className="assistant-inquiry-btn-cancel"
                      onClick={() => setShowInquiryForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="assistant-inquiry-btn-submit"
                      disabled={isSubmittingInquiry}
                    >
                      {isSubmittingInquiry ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="assistant-quick-actions">
                <button
                  type="button"
                  className="assistant-inquiry-trigger-btn"
                  onClick={() => setShowInquiryForm(true)}
                >
                  <Phone size={15} />
                  <span>📱 Leave BD Phone & Message (Get Direct Call/SMS)</span>
                </button>

                <p>QUICK ACTIONS</p>

                <div className="assistant-quick-grid">
                  {quickActionList.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="assistant-quick-button"
                      onClick={() => handleQuickAction(action.response)}
                    >
                      <HelpCircle size={16} />
                      <span>{action.label}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}

                  <button
                    type="button"
                    className="assistant-quick-button"
                    onClick={() => handleQuickAction('time')}
                  >
                    <Clock3 size={16} />
                    <span>Date & Time</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <form
            className="assistant-input-area"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(input)
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          <footer className="assistant-footer">
            <Sparkles size={12} />
            <span>Powered by Smart Assistant</span>
          </footer>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher-button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        aria-expanded={isOpen}
        aria-controls="floating-assistant-panel"
      >
        {isOpen ? <X size={25} /> : <MessageCircle size={25} />}
        {!isOpen && <span className="assistant-launcher-pulse" />}
      </button>
    </div>
  )
}

export default FloatingAssistant
