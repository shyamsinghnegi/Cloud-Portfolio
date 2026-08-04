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

const SITE_URL = "https://shyamsingh-negi.in"

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shyam Singh Negi — Cloud Engineer & Full Stack Developer",
  description:
    "Portfolio of Shyam Singh Negi, a Cloud Engineer and Full Stack Developer specializing in DevOps, serverless infrastructure, and Next.js applications.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Shyam Singh Negi — Cloud Engineer & Full Stack Developer",
    description:
      "Portfolio of Shyam Singh Negi, a Cloud Engineer and Full Stack Developer specializing in DevOps, serverless infrastructure, and Next.js applications.",
    url: SITE_URL,
    siteName: "Shyam Singh Negi",
    type: "website",
    images: [
      {
        url: "/bb.png",
        width: 850,
        height: 255,
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shyam Singh Negi — Cloud Engineer & Full Stack Developer",
    description:
      "Portfolio of Shyam Singh Negi, a Cloud Engineer and Full Stack Developer specializing in DevOps, serverless infrastructure, and Next.js applications.",
    images: ["/bb.png"],
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shyam Singh Negi",
  jobTitle: "Cloud Engineer & Full Stack Developer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/shyamsinghnegi",
    "https://linkedin.com/in/shyam-singhnegi",
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}