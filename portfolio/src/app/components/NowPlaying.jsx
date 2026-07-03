"use client"
import { useContext, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { HintCtx } from "../hint-context"
import "../styles/now-playing.css"

const EXIT_MS = 320
const AUTO_COLLAPSE_MS = 3000
const MOBILE_QUERY = "(max-width: 920px)"
const MORPH_MS = 380

const API_URL = process.env.NEXT_PUBLIC_NOWPLAYING_API_URL
const POLL_MS_PLAYING = 1500
const POLL_MS_IDLE = 5000

function sameTrack(a, b) {
  if (!a || !b) return a === b
  return a.isPlaying === b.isPlaying && a.title === b.title && a.artist === b.artist && a.songUrl === b.songUrl
}

export default function NowPlaying() {
  const { hintActive } = useContext(HintCtx)
  const pathname = usePathname()
  const [data, setData] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [morphing, setMorphing] = useState(null)
  const [justCollapsed, setJustCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const exitTimeoutRef = useRef(null)
  const collapseTimeoutRef = useRef(null)
  const shineTimeoutRef = useRef(null)
  const morphTimeoutRef = useRef(null)
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  function setMinimizedMorph(next) {
    if (!isMobile) { setMinimized(next); return }
    setMorphing(next ? "to-disc" : "to-pill")
    clearTimeout(morphTimeoutRef.current)
    morphTimeoutRef.current = setTimeout(() => {
      setMinimized(next)
      setMorphing(null)
    }, MORPH_MS)
  }

  useEffect(() => {
    if (!API_URL) return

    const state = { cancelled: false, timeoutId: null, wasPlaying: false, last: null }

    async function poll() {
      if (state.cancelled) return
      try {
        const res = await fetch(API_URL, { cache: "no-store" })
        if (state.cancelled) return
        if (res.ok) {
          const json = await res.json()
          if (state.cancelled) return
          if (!sameTrack(state.last, json)) {
            state.last = json
            setData(json)
          }
          state.wasPlaying = !!json.isPlaying
        }
      } catch {
        // silently ignore — widget just stays hidden/stale until next poll
      }
      if (!state.cancelled && !document.hidden) {
        state.timeoutId = setTimeout(poll, state.wasPlaying ? POLL_MS_PLAYING : POLL_MS_IDLE)
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        clearTimeout(state.timeoutId)
        state.timeoutId = null
      } else if (!state.timeoutId) {
        poll()
      }
    }

    poll()
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      state.cancelled = true
      clearTimeout(state.timeoutId)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    setIsMobile(mq.matches)
    const onChange = e => setIsMobile(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const isPlaying = !!data?.isPlaying
    if (isPlaying) {
      clearTimeout(exitTimeoutRef.current)
      setMounted(true)
      const raf = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(raf)
    }
    setShow(false)
    exitTimeoutRef.current = setTimeout(() => setMounted(false), EXIT_MS)
    return () => clearTimeout(exitTimeoutRef.current)
  }, [data?.isPlaying])

  // fresh reveal: whenever a track starts/changes, show the full pill and
  // (re)start the auto-collapse timer. Does NOT react to hintActive clearing,
  // so the widget resumes whatever state it was in before the hint appeared
  // instead of forcing itself back open.
  useEffect(() => {
    if (!data?.isPlaying) return
    clearTimeout(collapseTimeoutRef.current)
    clearTimeout(morphTimeoutRef.current)
    setMorphing(null)
    setMinimized(false)
    collapseTimeoutRef.current = setTimeout(() => {
      setMinimizedMorph(true)
      if (pathnameRef.current === "/") {
        setJustCollapsed(true)
        clearTimeout(shineTimeoutRef.current)
        shineTimeoutRef.current = setTimeout(() => setJustCollapsed(false), 1800)
      }
    }, AUTO_COLLAPSE_MS)
    return () => clearTimeout(collapseTimeoutRef.current)
  }, [data?.isPlaying, data?.title, data?.artist])

  if (!mounted || hintActive) return null

  function renderDisc(morphClass) {
    return (
      <button
        key="disc"
        type="button"
        className={`now-playing-disc${show ? " show" : ""}${morphClass}`}
        onClick={() => setMinimizedMorph(false)}
        aria-label={`Show now playing: ${data.title} by ${data.artist}`}
      >
        <span className="now-playing-disc-spin">
          {data.albumImageUrl && <img src={data.albumImageUrl} alt="" draggable={false} />}
          <span className="now-playing-disc-hole" aria-hidden="true" />
        </span>
        <span className="now-playing-disc-shine" aria-hidden="true" />
      </button>
    )
  }

  function renderMinPill() {
    return (
      <button
        key="min-pill"
        type="button"
        className={`now-playing now-playing-min${show ? " show" : ""}${justCollapsed ? " shine" : ""}`}
        onClick={() => setMinimizedMorph(false)}
        aria-label={`Show now playing: ${data.title} by ${data.artist}`}
      >
        <span className="now-playing-bars" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="now-playing-min-label">Shyam is listening</span>
      </button>
    )
  }

  function renderFullPill(morphClass) {
    return (
      <div key="full-pill" className={`now-playing${show ? " show" : ""}${morphClass}`}>
        <a
          href={data.songUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="now-playing-link"
          aria-label={`Shyam is listening to ${data.title} by ${data.artist}`}
        >
          <span className="now-playing-art">
            {data.albumImageUrl && <img src={data.albumImageUrl} alt="" draggable={false} />}
          </span>
          <span className="now-playing-info">
            <span className="now-playing-label">
              <span className="now-playing-bars" aria-hidden="true">
                <span /><span /><span />
              </span>
              Shyam is listening to
            </span>
            <span className="now-playing-title" key={`title-${data.title}-${data.artist}`}>{data.title}</span>
            <span className="now-playing-artist" key={`artist-${data.title}-${data.artist}`}>{data.artist}</span>
          </span>
        </a>
      </div>
    )
  }

  if (isMobile && morphing === "to-disc") {
    return <>{renderFullPill(" morph-out")}{renderDisc(" morph-in")}</>
  }
  if (isMobile && morphing === "to-pill") {
    return <>{renderDisc(" morph-out")}{renderFullPill(" morph-in")}</>
  }

  if (minimized) {
    return isMobile ? renderDisc("") : renderMinPill()
  }

  return renderFullPill("")
}
