"use client"
import { useEffect, useRef, useState } from "react"
import CardFront from "./CardFront"
import CardBack from "./CardBack"
import useBackGuard from "../components/useBackGuard"
import "../styles/flip-card.css"

export default function FlipCard() {
  const [side, setSide] = useState("front")
  const frontRef = useRef(null)
  const backRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    if (frontRef.current) frontRef.current.inert = side !== "front"
    if (backRef.current) backRef.current.inert = side !== "back"
  }, [side])

  // Flipping to "back" pushes a history entry so the browser's native
  // back gesture/button flips to front instead of leaving the site.
  useBackGuard(side === "back", () => setSide("front"))

  function scrollToTopThen(callback) {
    if (window.scrollY === 0) {
      callback()
      return
    }
    let settleTimer = null
    function handleScroll() {
      clearTimeout(settleTimer)
      settleTimer = setTimeout(finish, 80)
    }
    function finish() {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(settleTimer)
      callback()
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    settleTimer = setTimeout(finish, 80)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function flipToBack() {
    document.activeElement?.blur()
    scrollToTopThen(() => setSide("back"))
  }

  function scrollToBottomAfterFlip() {
    const card = cardRef.current
    if (!card) return
    function handleTransitionEnd(e) {
      if (e.target !== card) return
      card.removeEventListener("transitionend", handleTransitionEnd)
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
    }
    card.addEventListener("transitionend", handleTransitionEnd)
  }

  function flipToFront() {
    document.activeElement?.blur()
    scrollToTopThen(() => {
      scrollToBottomAfterFlip()
      window.history.back()
    })
  }

  return (
    <div className="flip-scene">
      <div aria-live="polite" className="sr-only">
        {side === "front" ? "showing about me" : "showing projects"}
      </div>
      <div className={`flip-card${side === "back" ? " is-back" : ""}`} ref={cardRef}>
        <div
          className={`flip-face${side === "back" ? " flip-face--offstage" : ""}`}
          ref={frontRef}
        >
          <CardFront onFlip={flipToBack} />
        </div>
        <div
          className={`flip-face flip-face--back${side === "front" ? " flip-face--offstage" : ""}`}
          ref={backRef}
        >
          <CardBack onFlip={flipToFront} />
        </div>
      </div>
    </div>
  )
}
