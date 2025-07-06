// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voice AI Assistant',
  description: 'A sophisticated voice-enabled AI assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
