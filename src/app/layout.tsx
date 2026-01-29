import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NimbusAI - Your AI Cloud Architect',
  description: 'Turn plain English ideas into visualized, auditable, and deployable AWS infrastructure in seconds.',
  keywords: 'AWS, cloud architecture, AI, infrastructure, terraform, devops',
  authors: [{ name: 'NimbusAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#050510',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}