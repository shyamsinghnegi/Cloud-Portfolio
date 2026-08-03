"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function CertThumbnail({ cert }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e) {
      if (e.key === "Escape") setLightboxOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen])

  return (
    <>
      <div className="cert-sleeve cert-sleeve--photo">
        <img
          src={cert.img}
          alt={`${cert.title} certificate`}
          className="cert-sleeve-img"
          onClick={() => setLightboxOpen(true)}
        />
      </div>

      {mounted && lightboxOpen && createPortal(
        <div className="shot-lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            type="button"
            className="shot-lightbox-close"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>
          <img
            src={cert.img}
            alt={`${cert.title} certificate`}
            className="shot-lightbox-img shot-lightbox-img--desktop"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>,
        document.body
      )}
    </>
  )
}
