"use client"
import { useState } from "react"
import { useTiltGlow } from "../components/use-tilt-glow"
import LottieIcon from "../components/LottieIcon"
import "../styles/contact.css"

const EMAIL = "shyamsinghnegi54@gmail.com"

const CHANNELS = [
  { id: "email",    label: "Email",    value: EMAIL,                          href: `mailto:${EMAIL}`,                                lottie: "/lottie/gmail.json",    slot: "a" },
  { id: "github",   label: "GitHub",   value: "github.com/shyamsinghnegi",    href: "https://github.com/shyamsinghnegi",              lottie: "/lottie/github.json",   slot: "b" },
  { id: "linkedin", label: "LinkedIn", value: "in/shyam-singhnegi",           href: "https://linkedin.com/in/shyam-singhnegi",        lottie: "/lottie/linkedin.json", slot: "c" },
  { id: "steam",    label: "Steam",    value: "Play with me",                 href: "https://steamcommunity.com/profiles/76561198361219534", lottie: "/lottie/steam.json", slot: "d" },
]

function ChannelCard({ c }) {
  const tilt = useTiltGlow(3)
  return (
    <a
      href={c.href}
      target={c.id === "email" ? undefined : "_blank"}
      rel={c.id === "email" ? undefined : "noopener noreferrer"}
      className={`channel-card channel-${c.slot} channel-${c.id}`}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="channel-glow" aria-hidden="true" />
      <span className="channel-icon">
        <LottieIcon src={c.lottie} size={c.slot === "a" || c.slot === "d" ? 30 : 26} />
      </span>
      <span className="channel-label">{c.label}</span>
      <span className="channel-value">{c.value}</span>
    </a>
  )
}

const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const MAX_LEN = { name: 120, email: 200, subject: 200, message: 5000 }
const ALLOWED_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
  "icloud.com", "live.com", "aol.com", "proton.me", "protonmail.com",
])

function fallbackToMailto(name, email, subject, message) {
  const body = `${message}\n\n—\n${name}\n${email}`
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailto
}

function validate({ name, email, subject, message }) {
  const errors = {}
  if (!name.trim()) errors.name = "Name is required"
  else if (name.length > MAX_LEN.name) errors.name = "Name is too long"

  const trimmedEmail = email.trim()
  if (!trimmedEmail) errors.email = "Email is required"
  else if (!EMAIL_RE.test(trimmedEmail)) errors.email = "Enter a valid email"
  else if (email.length > MAX_LEN.email) errors.email = "Email is too long"
  else if (!ALLOWED_EMAIL_DOMAINS.has(trimmedEmail.split("@")[1].toLowerCase()))
    errors.email = "Use a Gmail, Yahoo, Outlook, or similar personal email"

  if (!subject.trim()) errors.subject = "Subject is required"
  else if (subject.length > MAX_LEN.subject) errors.subject = "Subject is too long"

  if (!message.trim()) errors.message = "Message is required"
  else if (message.length > MAX_LEN.message) errors.message = "Message is too long"

  return errors
}

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")
  const [errors, setErrors] = useState({})

  function resetForm() {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setErrors({})
  }

  async function onSubmit(e) {
    e.preventDefault()
    const nextErrors = validate({ name, email, subject, message })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("sending")
    const values = { name, email, subject, message }
    resetForm()

    if (!CONTACT_API_URL) {
      fallbackToMailto(values.name, values.email, values.subject, values.message)
      setStatus("sent")
      return
    }

    try {
      const res = await fetch(`${CONTACT_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus("sent")
    } catch (err) {
      fallbackToMailto(values.name, values.email, values.subject, values.message)
      setStatus("sent")
    }
  }

  return (
    <section className="contact-section stage-el">
      <div className="contact-left">
        <div className="contact-head">
          <div className="ph-index">
            <span>05 / Contact</span>
          </div>
          <h2>Let&apos;s connect<span className="accent-dot">.</span></h2>
          <p>Open to remote roles and collaboration — reach out on any of these.</p>
        </div>

        <div className="channel-grid">
          {CHANNELS.map(c => <ChannelCard key={c.id} c={c} />)}
        </div>
      </div>

      <div className="form-panel">
        <div className="ph-index">
          <span>06 / Message</span>
        </div>
        <h2>Send a message<span className="accent-dot">.</span></h2>

        <form className="contact-form" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                maxLength={MAX_LEN.name}
                required
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </label>
            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={MAX_LEN.email}
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </label>
          </div>

          <label className="form-field">
            <span>Subject</span>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="What's this about?"
              maxLength={MAX_LEN.subject}
              required
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </label>

          <label className="form-field">
            <span>Message</span>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell me what you're building..."
              rows={5}
              maxLength={MAX_LEN.message}
              required
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </label>

          <button
            type="submit"
            className={`form-submit${status === "sending" ? " sending" : ""}${status === "sent" ? " sent" : ""}`}
            disabled={status === "sending"}
          >
            <span>{status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Send message"}</span>
            <span className="form-submit-bar" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}
