// "use client"

// import { useState, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import type React from "react" // Added import for React
import RootLayout2 from  './sublayout'
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return null
//   }

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<><RootLayout2 children={children}/></>)
}