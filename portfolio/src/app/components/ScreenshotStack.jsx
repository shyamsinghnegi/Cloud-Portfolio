"use client"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const AUTOPLAY_MS = 3500
const DRAG_THRESHOLD = 80

export default function ScreenshotStack({ screenshots, layout = "desktop" }) {
  const [order, setOrder] = useState(() => screenshots.map((_, i) => i))
  const [dragX, setDragX] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dragging = useRef(false)
  const wasDrag = useRef(false)
  const startX = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => setMounted(true), [])

  function cycle(dir = 1) {
    setOrder(o => {
      if (dir === 1) return [...o.slice(1), o[0]]
      return [o[o.length - 1], ...o.slice(0, -1)]
    })
  }

  useEffect(() => {
    if (screenshots.length < 2) return
    timerRef.current = setInterval(() => cycle(1), AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [screenshots.length])

  function resetAutoplay() {
    clearInterval(timerRef.current)
    if (screenshots.length > 1) {
      timerRef.current = setInterval(() => cycle(1), AUTOPLAY_MS)
    }
  }

  function onPointerDown(e) {
    dragging.current = true
    wasDrag.current = false
    startX.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) wasDrag.current = true
    setDragX(dx)
  }
  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    if (dragX > DRAG_THRESHOLD) cycle(-1)
    else if (dragX < -DRAG_THRESHOLD) cycle(1)
    setDragX(0)
    resetAutoplay()
  }
  function onCardClick() {
    if (wasDrag.current) return
    setLightboxOpen(true)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e) {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") { cycle(-1); resetAutoplay() }
      if (e.key === "ArrowRight") { cycle(1); resetAutoplay() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen])

  if (!screenshots || screenshots.length === 0) return null

  const current = screenshots[order[0]]

  return (
    <div className="shot-stack">
      <div className={`shot-stack-deck shot-stack-deck--${layout}`}>
        {order.map((idx, pos) => {
          const s = screenshots[idx]
          const isTop = pos === 0
          const offset = pos * 10
          const rotate = pos === 0 ? dragX / 12 : (pos % 2 === 0 ? 1 : -1) * pos
          const translateX = pos === 0 ? dragX : 0
          return (
            <div
              key={idx}
              className={`shot-card${isTop ? " is-top" : ""}`}
              style={{
                zIndex: screenshots.length - pos,
                transform: `translate(${translateX}px, ${offset}px) rotate(${rotate}deg)`,
                opacity: pos < 4 ? 1 : 0,
              }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerLeave={isTop ? onPointerUp : undefined}
              onClick={isTop ? onCardClick : undefined}
            >
              {s.src ? (
                <img src={s.src} alt={s.alt || ""} draggable={false} />
              ) : (
                <div className="shot-placeholder">
                  <span>{s.alt || "Screenshot"}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {screenshots.length > 1 && (
        <div className="shot-controls">
          <button
            type="button"
            className="shot-arrow"
            aria-label="Previous screenshot"
            onClick={() => { cycle(-1); resetAutoplay() }}
          >
            ‹
          </button>
          <div className="shot-dots">
            {screenshots.map((_, i) => (
              <span key={i} className={`shot-dot${order[0] === i ? " active" : ""}`} />
            ))}
          </div>
          <button
            type="button"
            className="shot-arrow"
            aria-label="Next screenshot"
            onClick={() => { cycle(1); resetAutoplay() }}
          >
            ›
          </button>
        </div>
      )}

      {mounted && lightboxOpen && current.src && createPortal(
        <div className="shot-lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            type="button"
            className="shot-lightbox-close"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>

          {screenshots.length > 1 && (
            <button
              type="button"
              className="shot-lightbox-nav shot-lightbox-prev"
              aria-label="Previous screenshot"
              onClick={(e) => { e.stopPropagation(); cycle(-1); resetAutoplay() }}
            >
              ‹
            </button>
          )}

          <img
            src={current.src}
            alt={current.alt || ""}
            className={`shot-lightbox-img shot-lightbox-img--${layout}`}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {screenshots.length > 1 && (
            <button
              type="button"
              className="shot-lightbox-nav shot-lightbox-next"
              aria-label="Next screenshot"
              onClick={(e) => { e.stopPropagation(); cycle(1); resetAutoplay() }}
            >
              ›
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
