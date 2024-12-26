import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

import {
  ClerkProvider
} from '@clerk/nextjs'

import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'TrackerDo',
  description: 'Track prices effortlessly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main>
            <Navbar />
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
