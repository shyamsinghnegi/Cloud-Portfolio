import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#0d0d0c",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(207,139,92,0.16), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#cf8b5c",
            marginBottom: 28,
          }}
        >
          profile
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#f2f1ee",
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Shyam Singh Negi
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#a8a6a0",
            marginTop: 28,
          }}
        >
          Cloud Engineer / DevOps / Full Stack Developer
        </div>
      </div>
    ),
    { ...size }
  )
}
