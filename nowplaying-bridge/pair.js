require("dotenv").config({ path: ".env.local" })
const { CompanionConnector } = require("ytmdesktop-ts-companion")

const HOST = process.env.YTMD_HOST || "127.0.0.1"
const PORT = Number(process.env.YTMD_PORT || 9863)

async function main() {
  console.log("--- YTMDesktop Companion Pairing ---\n")
  console.log(`Connecting to YTMDesktop at ${HOST}:${PORT}...`)
  console.log("Make sure YTMDesktop is running and its Companion Server is enabled")
  console.log("(Settings -> Integrations -> Companion Server).\n")

  const connector = new CompanionConnector({
    host: HOST,
    port: PORT,
    appId: "shyam-portfolio-bridge",
    appName: "Portfolio Now Playing Bridge",
    appVersion: "1.0.0",
  })

  const { code } = await connector.restClient.getAuthCode()
  console.log(`A pairing prompt should now appear inside YTMDesktop.`)
  console.log(`If asked for a code, use: ${code}`)
  console.log("Approve it within 30 seconds...\n")

  const { token } = await connector.restClient.getAuthToken(code)

  console.log("--- Success! ---")
  console.log("Add this to nowplaying-bridge/.env.local:\n")
  console.log(`YTMD_AUTH_TOKEN=${token}`)
}

main().catch(err => {
  console.error("Pairing failed:", err.message || err)
  process.exit(1)
})
