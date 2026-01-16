import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Rwanda Inspection Application',
  description: 'Rwanda Inspection Apps',
  
  icons: {
    icon: [
      {
        url: '/rwanda-coat-of-arms.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/rwanda-coat-of-arms.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/rwanda-coat-of-arms.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
