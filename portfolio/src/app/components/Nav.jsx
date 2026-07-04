"use client"
import { PATHS } from "../transition-layout"

const SECTIONS = [
  { id: "about",    label: "About Me",        ix: "01" },
  { id: "projects", label: "Projects",         ix: "02" },
  { id: "hobbies",  label: "Hobbies / Gaming", ix: "03" },
  { id: "contact",  label: "Contact Me",       ix: "04" },
]

const ALL_NAV = [
  { id: "home", label: "HOME", icon: (
    <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
  )},
  { id: "about", label: "ABOUT", icon: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  )},
  { id: "projects", label: "PROJECTS", icon: (
    <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
  )},
  { id: "hobbies", label: "HOBBIES", icon: (
    <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 11h2M17 13h2"/></svg>
  )},
  { id: "contact", label: "CONTACT", icon: (
    <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
  )},
]

export default function Nav({ onNavigate, expanded = false, currentSection = "home" }) {
  return (
    <>
      <nav className={`nav-expanded${expanded ? " show" : ""}`} aria-hidden={!expanded}>
        <div className="nav-head">
          <span className="mono">Navigation — 04</span>
        </div>
        <ul className="nav-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={PATHS[s.id]}
                className="nav-link"
                onClick={(e) => { e.preventDefault(); onNavigate(s.id) }}
                tabIndex={expanded ? 0 : -1}
              >
                <span className="arr">→</span>
                <span className="lbl">{s.label}</span>
                <span className="ix">{s.ix}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={`nav-collapsed${!expanded ? " show" : ""}`} aria-hidden={expanded}>
        {ALL_NAV.map((s) => (
          <a
            key={s.id}
            href={PATHS[s.id]}
            className={`glass-icon ${currentSection === s.id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              const btn = e.currentTarget
              const rect = btn.getBoundingClientRect()
              btn.style.setProperty("--wash-x", `${e.clientX - rect.left}px`)
              btn.style.setProperty("--wash-y", `${e.clientY - rect.top}px`)
              btn.classList.remove("washing")
              void btn.offsetWidth
              btn.classList.add("washing")
              onNavigate(s.id)
            }}
            aria-label={s.label}
            aria-current={currentSection === s.id ? "page" : undefined}
            tabIndex={expanded ? -1 : 0}
          >
            <span className="gi-wash" aria-hidden="true" />
            {s.icon}
          </a>
        ))}
      </nav>
    </>
  )
}
