"use client"
import { useState } from "react"
import { useTiltGlow } from "../components/use-tilt-glow"
import "../styles/contact.css"

const EMAIL = "shyamsinghnegi54@gmail.com"

const GhIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)
const LiIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect className="li-box" x="2" y="2" width="20" height="20" rx="4" />
    <path className="li-mark" d="M7 10v7M7 6.5v.01M11 17v-4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path className="mail-body" d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path className="mail-flap" d="M3.5 7 12 13l8.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SteamIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.95 2 2.79 5.82 2.14 10.75l5.42 2.28a2.85 2.85 0 0 1 1.63-.51c.15 0 .3.01.44.04l2.41-3.53v-.05a3.83 3.83 0 1 1 3.83 3.83h-.09l-3.44 2.48c0 .12.02.25.02.37a2.86 2.86 0 1 1-5.62-.72L2.5 12.87A10 10 0 1 0 12 2z" />
    <circle cx="14.87" cy="8.94" r="2.4" />
  </svg>
)

const CHANNELS = [
  { id: "email",    label: "Email",    value: EMAIL,                          href: `mailto:${EMAIL}`,                                icon: MailIcon,  slot: "a" },
  { id: "github",   label: "GitHub",   value: "github.com/shyamsinghnegi",    href: "https://github.com/shyamsinghnegi",              icon: GhIcon,    slot: "b" },
  { id: "linkedin", label: "LinkedIn", value: "in/shyam-singhnegi",           href: "https://linkedin.com/in/shyam-singhnegi",        icon: LiIcon,    slot: "c" },
  { id: "steam",    label: "Steam",    value: "Play with me",                 href: "https://steamcommunity.com/profiles/76561198361219534", icon: SteamIcon, slot: "d" },
]

function ChannelCard({ c }) {
  const tilt = useTiltGlow(3)
  const Icon = c.icon
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
        <Icon />
      </span>
      <span className="channel-label">{c.label}</span>
      <span className="channel-value">{c.value}</span>
    </a>
  )
}

const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL

function fallbackToMailto(name, email, subject, message) {
  const body = `${message}\n\n—\n${name}\n${email}`
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailto
}

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")

  async function onSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return

    setStatus("sending")

    if (!CONTACT_API_URL) {
      fallbackToMailto(name, email, subject, message)
      setStatus("sent")
      return
    }

    try {
      const res = await fetch(`${CONTACT_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus("sent")
    } catch (err) {
      fallbackToMailto(name, email, subject, message)
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
                required
              />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
          </div>

          <label className="form-field">
            <span>Subject</span>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="What's this about?"
              required
            />
          </label>

          <label className="form-field">
            <span>Message</span>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell me what you're building..."
              rows={5}
              required
            />
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
