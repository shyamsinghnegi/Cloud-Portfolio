require("dotenv").config({ path: ".env.local" })
const { CompanionConnector, SocketState } = require("ytmdesktop-ts-companion")

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

// The library's CompanionConnector constructor calls getMetadata() and re-throws
// inside its own .catch(), producing an unhandled rejection whenever YTMDesktop
// is unreachable (e.g. app closed). That's an expected, recoverable state here,
// not a real crash — swallow it so the process stays alive and keeps retrying.
process.on("unhandledRejection", err => {
  console.error("Unhandled rejection (ignored):", err && err.message ? err.message : err)
})

// trackState: -1 unknown, 0 paused, 1 playing, 2 buffering
const PLAYING_STATE = 1

// The API marks a track stale after 180s of no update (see backend), so a
// currently-playing track needs to be re-pushed well before then or long
// songs make the widget disappear near the end even though nothing changed.
const HEARTBEAT_MS = 90 * 1000

let lastVideoId = null
let lastIsPlaying = null
let lastPlayingBody = null

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
    lastPlayingBody = null
    pushState({ isPlaying: false })
    return
  }

  const thumb = (video.thumbnails || []).slice(-1)[0]
  lastPlayingBody = {
    isPlaying: true,
    title: video.title,
    artist: video.author,
    album: video.album || null,
    albumImageUrl: thumb ? thumb.url : null,
    songUrl: video.id ? `https://music.youtube.com/watch?v=${video.id}` : null,
  }
  pushState(lastPlayingBody)
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
  connector.socketClient.addConnectionStateListener(state => {
    console.log(`Socket state: ${state}`)
    if (state === SocketState.CONNECTED) {
      connector.restClient.getState().then(onState).catch(err => {
        console.error("getState error:", err.message || err)
      })
    } else if (state === SocketState.DISCONNECTED || state === SocketState.ERROR) {
      if (lastIsPlaying !== false) {
        lastVideoId = null
        lastIsPlaying = false
        pushState({ isPlaying: false })
      }
    }
  })
  connector.socketClient.connect()

  setInterval(() => {
    if (lastPlayingBody) pushState(lastPlayingBody)
  }, HEARTBEAT_MS)

  process.on("SIGINT", () => {
    pushState({ isPlaying: false }).finally(() => process.exit(0))
  })
}

main()
