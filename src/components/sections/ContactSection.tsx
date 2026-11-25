
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react'
import { contactConfig as defaultContactConfig } from '../../config'
import { api } from '../../services/api'
import './ContactSection.css'

function ContactSection() {
  const [contactData, setContactData] = useState(defaultContactConfig)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isActive = true
    api.contact.getMeta()
      .then((res) => {
        if (isActive && res?.success && res?.data) {
          setContactData((prev) => ({
            ...prev,
            ...res.data,
          }))
        }
      })
      .catch((err) => {
        console.error('Failed to load contact meta:', err)
      })
    return () => {
      isActive = false
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await api.contact.submitMessage({
        name: (formData.get('name') as string) || '',
        email: (formData.get('email') as string) || '',
        subject: (formData.get('subject') as string) || '',
        message: (formData.get('message') as string) || '',
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Contact submission error:', err)
      setErrorMsg('Failed to send message. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-heading">
          <span>{contactData.eyebrow}</span>
          <h2>
            {contactData.title}
          </h2>
          <p>{contactData.description}</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-info-top">
              <span className="contact-info-label">
                CONTACT INFORMATION
              </span>

              <h3>Let's start a conversation.</h3>

              <p>
                We're always interested in hearing about new ideas,
                opportunities and collaborations.
              </p>
            </div>

            <div className="contact-details">
              <a href={`mailto:${contactData.email}`} className="contact-detail">
                <div className="contact-detail-icon">
                  <Mail size={21} />
                </div>
                <div>
                  <span>Email us</span>
                  <strong>{contactData.email}</strong>
                </div>
                <ArrowUpRight size={19} />
              </a>

              <a href={`tel:${contactData.phone}`} className="contact-detail">
                <div className="contact-detail-icon">
                  <Phone size={21} />
                </div>
                <div>
                  <span>Call us</span>
                  <strong>{contactData.phone}</strong>
                </div>
                <ArrowUpRight size={19} />
              </a>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <MapPin size={21} />
                </div>
                <div>
                  <span>Our location</span>
                  <strong>{contactData.address}</strong>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${contactData.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="contact-whatsapp"
            >
              <MessageCircle size={20} />
              Chat with us on WhatsApp
              <ArrowUpRight size={18} />
            </a>

            <div className="contact-decoration">LET'S TALK</div>
          </div>

          <div className="contact-form-panel">
            <div className="contact-form-heading">
              <span>YOUR NEXT BIG IDEA</span>
              <h3>{contactData.formTitle}</h3>
              <p>{contactData.formDescription}</p>
            </div>

            {submitted ? (
              <div className="contact-success">
                <CheckCircle2 size={45} />
                <h3>Thank you for reaching out!</h3>
                <p>
                  This is a demonstration form. Message delivery will be
                  connected when we build the backend.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <label>
                    Your name
                    <input
                      type="text"
                      name="name"
                      placeholder="John Smith"
                      required
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                    />
                  </label>
                </div>

                <label>
                  Subject
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    required
                  />
                </label>

                <label>
                  Your message
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us about your project..."
                    required
                  />
                </label>

                {errorMsg && (
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '8px 0' }}>{errorMsg}</p>
                )}

                <button type="submit" className="contact-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={18} />
                </button>

                <p className="contact-form-note">
                  We'll get back to you as soon as possible.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
