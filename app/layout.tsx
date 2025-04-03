import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"

export const metadata: Metadata = {
  title: "CureConnect - Your Health, Our Priority",
  description: "Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities.",
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden">
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  )
}



import './globals.css'