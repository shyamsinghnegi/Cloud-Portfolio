"use client"
import { useRef, useState } from "react"
import { TECH } from "../data/stack"
import { CERTS } from "../data/certs"
import ContactLinks from "./ContactLinks"
import CertList from "./CertList"
import CertDetail from "./CertDetail"
import CertCover from "./CertCover"
import CertThumbnail from "./CertThumbnail"
import useBackGuard from "../components/useBackGuard"
import "../styles/cert-list.css"
import "../styles/project-row.css"

const HEADLINE = "Full stack developer. I build and ship products end to end, from Next.js frontends to serverless infrastructure."

const BIO_PARAGRAPHS = [
  "Based in Delhi, India. Cloud stays in the toolkit as a differentiator — not the identity — while the day-to-day is writing the frontend, the API, and the infrastructure it all runs on.",

  "I enjoy working on projects where software has to move beyond a prototype and perform reliably in real-world conditions. For me, the most interesting part is understanding the constraints, solving the engineering problems, and turning an idea into something that actually works.",

  "I spend time picking apart how systems fail — reading postmortems, rebuilding small pieces of infrastructure from scratch to understand them properly, and keeping up with tools before I actually need them on a project.",
]

const EDUCATION = [
  { degree: "mca", school: "jims, rohini sector 5", dateRange: "2024 — 2026" },
  { degree: "bca", school: "iitm, janakpuri", dateRange: "2021 — 2024" },
]

const LANGUAGES = ["english", "hindi", "japanese"]

function pairUp(arr) {
  const pairs = []
  for (let i = 0; i < arr.length; i += 2) pairs.push(arr.slice(i, i + 2))
  return pairs
}

function BioParagraphs() {
  return BIO_PARAGRAPHS.map((p) => (
    <p className="bio-p" key={p}>{p}</p>
  ))
}

function StackList() {
  return (
    <>
      <div className="meta-label">stack</div>
      <ul className="meta-list">
        {pairUp(TECH).map((pair) => (
          <li className="meta-value" key={pair[0].id}>
            {pair.map(t => t.label.toLowerCase()).join(" · ")}
          </li>
        ))}
      </ul>
    </>
  )
}

function EducationList() {
  return (
    <>
      <div className="meta-label">education</div>
      {EDUCATION.map((e) => (
        <div key={e.degree} className="edu-entry">
          <p className="meta-value">
            {e.degree}
            <br />
            {e.school}
          </p>
          <p className="edu-dates">{e.dateRange}</p>
        </div>
      ))}
    </>
  )
}

function LanguagesList() {
  return (
    <>
      <div className="meta-label">languages</div>
      <p className="meta-value">{LANGUAGES.join(" · ")}</p>
    </>
  )
}

function FindMe() {
  return (
    <>
      <div className="meta-label">find me</div>
      <ContactLinks />
    </>
  )
}

function CertSection({ activeCert, sleeveCert, onSelect, onHover, onBack }) {
  return (
    <div className="detail-pane cert-section--center">
      <div className="section-label">certifications</div>
      <div className="cert-sleeve-row">
        <div className="cert-sleeve-col">
          {activeCert ? (
            <CertThumbnail cert={activeCert} />
          ) : (
            <div className="cert-sleeve">
              <CertCover cert={sleeveCert} size="lg" />
            </div>
          )}
          <p className="sleeve-caption">{activeCert ? activeCert.issuer : sleeveCert.issuer}</p>
        </div>
        <div className="cert-list-col">
          {activeCert ? (
            <div key="cert-detail" className="pane-content">
              <CertDetail cert={activeCert} onBack={onBack} />
            </div>
          ) : (
            <div key="cert-list" className="pane-content">
              <CertList certs={CERTS} onSelect={onSelect} onHover={onHover} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CardFront({ onFlip }) {
  const [activeCertIdx, setActiveCertIdx] = useState(null)
  const [hoverCertIdx, setHoverCertIdx] = useState(null)
  const activeCert = activeCertIdx !== null ? CERTS[activeCertIdx] : null
  const sleeveCert = CERTS[hoverCertIdx ?? 0]
  const certSectionRef = useRef(null)

  function scrollCertIntoView() {
    certSectionRef.current?.scrollIntoView({ block: "nearest" })
  }

  useBackGuard(activeCertIdx !== null, () => { setActiveCertIdx(null); scrollCertIntoView() })

  const certSection = (
    <div ref={certSectionRef}>
      <CertSection
        activeCert={activeCert}
        sleeveCert={sleeveCert}
        onSelect={(i) => { setActiveCertIdx(i); scrollCertIntoView() }}
        onHover={setHoverCertIdx}
        onBack={() => window.history.back()}
      />
    </div>
  )

  return (
    <>
      <div className="card-header">
        <div className="mark-row">
          <span className="mark-avatar">
            <img src="/avatar.svg" alt="" />
          </span>
          <span className="mark-name">shyam</span>
        </div>
        <span className="corner-label">profile</span>
      </div>

      <div className="card-scroll">
        {/* Desktop layout: bio+certs column beside stack/education/languages sidebar */}
        <div className="bio-row front-desktop-only">
          <div className="bio-col">
            <p className="bio-headline">{HEADLINE}</p>
            <BioParagraphs />
            {certSection}
          </div>

          <div className="meta-col">
            <StackList />
            <EducationList />
            <LanguagesList />
            <FindMe />
          </div>
        </div>

        {/* Mobile layout: paragraphs -> stack/education/languages -> projects button -> certs -> footer */}
        <div className="front-mobile-only">
          <div className="bio-col">
            <p className="bio-headline">{HEADLINE}</p>
            <div><BioParagraphs /></div>
          </div>

          <div className="meta-col meta-col--mobile">
            <StackList />
            <EducationList />
            <LanguagesList />
          </div>

          {certSection}

          <div className="mobile-footer">
            <div className="find-me-row">
              <div className="meta-label">find me</div>
              <ContactLinks />
            </div>
            <div className="mobile-footer-bottom">
              <span className="location-text">delhi, india</span>
              <button type="button" className="flip-btn flip-btn--specular" onClick={onFlip} aria-label="flip to projects">
                projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer split front-desktop-only">
        <span className="location-text">delhi, india</span>
        <button type="button" className="flip-btn flip-btn--specular" onClick={onFlip} aria-label="flip to projects">
          projects
        </button>
      </div>
    </>
  )
}
