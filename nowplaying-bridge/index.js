require("dotenv").config({ path: ".env.local" })
const { CompanionConnector } = require("ytmdesktop-ts-companion")

const HOST = process.env.YTMD_HOST || "127.0.0.1"
const PORT = Number(process.env.YTMD_PORT || 9863)
const AUTH_TOKEN = process.env.YTMD_AUTH_TOKEN
const API_URL = process.env.NOWPLAYING_API_URL
const WRITE_SECRET = process.env.NOWPLAYING_WRITE_SECRET

if (!AUTH_TOKEN) {
  console.error("Missing YTMD_AUTH_TOKEN. Run `npm run pair` first.")
  process.exit(1)
}
if (!API_URL || !WRITE_SECRET) {
  console.error("Missing NOWPLAYING_API_URL or NOWPLAYING_WRITE_SECRET in .env.local")
  process.exit(1)
}

// trackState: -1 unknown, 0 paused, 1 playing, 2 buffering
const PLAYING_STATE = 1

let lastVideoId = null
let lastIsPlaying = null

async function pushState(body) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Write-Secret": WRITE_SECRET },
      body: JSON.stringify(body),
    })
    if (!res.ok) console.error(`Push failed: ${res.status} ${await res.text()}`)
    else console.log(body.isPlaying ? `Pushed: ${body.title} - ${body.artist}` : "Pushed: not playing")
  } catch (err) {
    console.error("Push error:", err.message || err)
  }
}

function onState(state) {
  const player = state.player || {}
  const video = state.video || {}
  const isPlaying = player.trackState === PLAYING_STATE

  if (video.id === lastVideoId && isPlaying === lastIsPlaying) return
  lastVideoId = video.id
  lastIsPlaying = isPlaying

  if (!isPlaying) {
    pushState({ isPlaying: false })
    return
  }

  const thumb = (video.thumbnails || []).slice(-1)[0]
  pushState({
    isPlaying: true,
    title: video.title,
    artist: video.author,
    album: video.album || null,
    albumImageUrl: thumb ? thumb.url : null,
    songUrl: video.id ? `https://music.youtube.com/watch?v=${video.id}` : null,
  })
}

async function main() {
  console.log(`Connecting to YTMDesktop at ${HOST}:${PORT}...`)

  const connector = new CompanionConnector({
    host: HOST,
    port: PORT,
    appId: "shyam-portfolio-bridge",
    appName: "Portfolio Now Playing Bridge",
    appVersion: "1.0.0",
  })
  connector.setAuthToken(AUTH_TOKEN)

  connector.socketClient.addStateListener(onState)
  connector.socketClient.addConnectionStateListener(connected => {
    console.log(connected ? "Connected to YTMDesktop." : "Disconnected from YTMDesktop.")
  })
  connector.socketClient.connect()

  process.on("SIGINT", () => {
    pushState({ isPlaying: false }).finally(() => process.exit(0))
  })
}

main()
