"use client"
import { useEffect, useRef } from "react"

let nextGuardId = 0

// Pushes a history entry whenever `active` becomes true, so the browser's
// back gesture/button calls `onBack` instead of leaving the page. Each guard
// gets its own id and only reacts to popstate when the browser has moved to
// a history entry that no longer includes that id — so a single back-step
// only unwinds the one guard whose entry was actually popped, not every
// nested guard on the page.
export default function useBackGuard(active, onBack) {
  const idRef = useRef(null)
  if (idRef.current === null) idRef.current = ++nextGuardId
  const onBackRef = useRef(onBack)
  const pushedRef = useRef(false)

  useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  useEffect(() => {
    if (active && !pushedRef.current) {
      const prevGuards = window.history.state?.backGuards || []
      window.history.pushState({ backGuards: [...prevGuards, idRef.current] }, "")
      pushedRef.current = true
    } else if (!active) {
      pushedRef.current = false
    }
  }, [active])

  useEffect(() => {
    function handlePopState(e) {
      const guards = e.state?.backGuards || []
      if (pushedRef.current && !guards.includes(idRef.current)) {
        pushedRef.current = false
        onBackRef.current()
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])
}
