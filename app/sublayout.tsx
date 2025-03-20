"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import type React from "react" // Added import for React

export function RootLayout2({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout2;

import './globals.css'
