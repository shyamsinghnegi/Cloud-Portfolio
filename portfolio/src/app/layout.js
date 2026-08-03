import { Inter, JetBrains_Mono } from "next/font/google"
import "./styles/globals.css"
import AppShell from "./app-shell"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const metadata = {
  title: "SHYAM SINGH NEGI",
  description: "Cloud Engineer / DevOps / Backend",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body><AppShell>{children}</AppShell></body>
    </html>
  )
}