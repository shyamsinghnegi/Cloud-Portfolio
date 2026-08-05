"use client"
import NowPlaying from "./components/NowPlaying"
import Grain from "./components/Grain"

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Grain />
      <main>{children}</main>
      <NowPlaying />
    </div>
  )
}
