"use client"
import { useEffect, useRef, useState } from "react"
import Lottie from "lottie-react"

const REPLAY_DELAY_MS = 3500
const PLAY_SPEED = 1.6

export default function LottieIcon({ src, className = "", size = 20 }) {
  const [data, setData] = useState(null)
  const lottieRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then(res => res.json())
      .then(json => { if (!cancelled) setData(json) })
    return () => { cancelled = true }
  }, [src])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  if (!data) return <span className={className} style={{ width: size, height: size, display: "inline-block" }} aria-hidden="true" />

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      loop={false}
      autoplay
      speed={PLAY_SPEED}
      className={className}
      style={{ width: size, height: size }}
      onComplete={() => {
        timeoutRef.current = setTimeout(() => lottieRef.current?.goToAndPlay(0), REPLAY_DELAY_MS)
      }}
    />
  )
}
