"use client"
import { useEffect, useRef, useState } from "react"
import CardFront from "./CardFront"
import CardBack from "./CardBack"
import "../styles/flip-card.css"

const FLIP_DURATION_MS = 900

export default function FlipCard() {
  const [side, setSide] = useState("front")
  const [settledSide, setSettledSide] = useState("front")
  const frontRef = useRef(null)
  const backRef = useRef(null)

  useEffect(() => {
    if (frontRef.current) frontRef.current.inert = side !== "front"
    if (backRef.current) backRef.current.inert = side !== "back"
  }, [side])

  useEffect(() => {
    if (side === settledSide) return
    const timer = setTimeout(() => setSettledSide(side), FLIP_DURATION_MS)
    return () => clearTimeout(timer)
  }, [side, settledSide])

  return (
    <div className="flip-scene">
      <div aria-live="polite" className="sr-only">
        {side === "front" ? "showing about me" : "showing projects"}
      </div>
      <div className={`flip-card${side === "back" ? " is-back" : ""}`}>
        <div
          className={`flip-face${settledSide === "back" ? " flip-face--offstage" : ""}`}
          ref={frontRef}
        >
          <CardFront onFlip={() => { document.activeElement?.blur(); setSide("back") }} />
        </div>
        <div
          className={`flip-face flip-face--back${settledSide === "front" ? " flip-face--offstage" : ""}`}
          ref={backRef}
        >
          <CardBack onFlip={() => { document.activeElement?.blur(); setSide("front") }} />
        </div>
      </div>
    </div>
  )
}
