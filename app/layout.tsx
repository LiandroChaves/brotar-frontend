import type React from "react"
// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TokenExpiredModal } from "@/components/TokenExpiredModal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brotar Admin",
  description: "Gerenciamento do Instituto Brotar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <TokenExpiredModal />
        </ThemeProvider>
      </body>
    </html>
  )
}
