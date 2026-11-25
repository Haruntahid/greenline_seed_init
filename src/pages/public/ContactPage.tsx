
import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import { contactConfig } from '../../config'
import { api } from '../../services/api'
import './ContactPage.css'

const faqItems = [
  {
    question: 'What products and services does your company offer?',
    answer:
      'We offer a range of products and services designed to support our customers and business partners. Contact our team to learn more about our current offerings.',
  },
  {
    question: 'How can I request a product catalogue?',
    answer:
      'You can request our latest product catalogue by submitting the contact form or reaching out to us directly by email or phone.',
  },
  {
    question: 'Do you provide customized business solutions?',
    answer:
      'Yes. We welcome discussions about specific business requirements and explore suitable solutions based on your needs.',
  },
  {
    question: 'How can I become a business partner or distributor?',
    answer:
      'Send us your business details and partnership interests through the contact form. Our team can discuss potential collaboration opportunities.',
  },
  {
    question: 'Do you serve customers outside Bangladesh?',
    answer:
      'Please contact our team with your location and requirements so we can confirm the availability of our products and services.',
  },
  {
    question: 'How can I request a quotation?',
    answer:
      'Share your requirements, product interests and estimated quantities through our contact form. Our team will follow up regarding your quotation.',
  },
  {
    question: 'How long does it take to receive a response?',
    answer:
      'Our team aims to respond to enquiries as soon as possible during regular business hours.',
  },
]

function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setSubmitted(false)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await api.contact.submitMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      })

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      console.error('Contact submission error:', err)
      setSubmitError('Unable to send message right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-orb contact-hero-orb-one" />
        <div className="contact-hero-orb contact-hero-orb-two" />

        <div className="contact-container contact-hero-content">
          <span className="contact-eyebrow">
            <span />
            {contactConfig.eyebrow}
          </span>

          <h1>
            Let's start a
            <br />
            <span>meaningful conversation.</span>
          </h1>

          <p>{contactConfig.description}</p>

          <a href="#contact-details" className="contact-hero-link">
            Talk to our team
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="contact-hero-decoration">HELLO</div>
      </section>

      {/* CONTACT FORM */}
      <section className="contact-main-section" id="contact-details">
        <div className="contact-container">
          <div className="contact-main-card">
            <aside className="contact-info-panel">
              <span className="contact-section-label">LET'S CONNECT</span>

              <h2>
                We're just
                <br />
                a message away.
              </h2>

              <p>
                Whether you have a question, a project idea or a partnership
                opportunity, we'd love to hear from you.
              </p>

              <div className="contact-info-list">
                <a href={`mailto:${contactConfig.email}`} className="contact-info-item">
                  <span className="contact-info-icon">
                    <Mail size={19} />
                  </span>
                  <span>
                    <small>EMAIL US</small>
                    <strong>{contactConfig.email}</strong>
                  </span>
                  <ArrowUpRight size={16} />
                </a>

                <a href={`tel:${contactConfig.phone}`} className="contact-info-item">
                  <span className="contact-info-icon">
                    <Phone size={19} />
                  </span>
                  <span>
                    <small>CALL US</small>
                    <strong>{contactConfig.phone}</strong>
                  </span>
                  <ArrowUpRight size={16} />
                </a>

                <div className="contact-info-item">
                  <span className="contact-info-icon">
                    <MapPin size={19} />
                  </span>
                  <span>
                    <small>VISIT US</small>
                    <strong>{contactConfig.address}</strong>
                  </span>
                </div>

                <a
                  href={`https://wa.me/${contactConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-info-item"
                >
                  <span className="contact-info-icon">
                    <MessageCircle size={19} />
                  </span>
                  <span>
                    <small>WHATSAPP</small>
                    <strong>Chat with our team</strong>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="contact-availability">
                <Clock3 size={17} />
                <span>We look forward to hearing from you.</span>
              </div>

              <div className="contact-info-decoration">C</div>
            </aside>

            <div className="contact-form-panel">
              <div className="contact-form-heading">
                <span className="contact-section-label">
                  HAVE SOMETHING IN MIND?
                </span>
                <h2>{contactConfig.formTitle}</h2>
                <p>{contactConfig.formDescription}</p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">Your name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      minLength={2}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">Email address *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-phone">Phone number</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880"
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-subject">Subject *</label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General enquiry">General enquiry</option>
                      <option value="Product information">Product information</option>
                      <option value="Business partnership">Business partnership</option>
                      <option value="Quotation request">Quotation request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">Your message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a little about what you have in mind..."
                    rows={5}
                    required
                    minLength={10}
                  />
                </div>

                {submitError && (
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '8px 0' }}>{submitError}</p>
                )}

                <button type="submit" className="contact-submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send your message'}
                  <Send size={17} />
                </button>

                {submitted && (
                  <div className="contact-success-message" role="status">
                    <Check size={18} />
                    <span>
                      Thank you! Your message has been sent and stored in the database. Our team will get back to you shortly.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="contact-faq-section">
        <div className="contact-container">
          <div className="contact-faq-layout">
            <div className="contact-faq-intro">
              <div className="contact-question-mark">?</div>

              <span className="contact-eyebrow">
                <span />
                GOOD TO KNOW
              </span>

              <h2>
                Questions?
                <br />
                <span>We've got answers.</span>
              </h2>

              <p>
                Find answers to some of the most common questions about our
                company, products and services.
              </p>

              <a href={`mailto:${contactConfig.email}`}>
                Still have questions?
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="contact-faq-list">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index

                return (
                  <div
                    className={`contact-faq-item ${isOpen ? 'is-open' : ''}`}
                    key={item.question}
                  >
                    <button
                      type="button"
                      className="contact-faq-question"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                    >
                      <span className="contact-faq-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span>{item.question}</span>

                      <ChevronDown
                        size={20}
                        className="contact-faq-chevron"
                      />
                    </button>

                    {isOpen && (
                      <div className="contact-faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      {contactConfig.mapEnabled && (
        <section className="contact-location-section">
          <div className="contact-container">
            <span className="contact-section-label">OUR LOCATION</span>
            <h2>Come say hello.</h2>
            <p>{contactConfig.address}</p>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="contact-final-cta">
        <div className="contact-container">
          <span>EVERY GREAT PARTNERSHIP STARTS WITH A CONVERSATION</span>
          <h2>Let's make something meaningful together.</h2>
          <a href={`mailto:${contactConfig.email}`}>
            Start a conversation
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </main>
  )
}

export default ContactPage
