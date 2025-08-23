import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { headers } from 'next/headers'
import ReownProvider from '@/components/ReownProvider'
import { KYCProvider } from '@/components/KYCProvider'
import { AIChat } from '@/components/AIChat'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
      title: 'AztlanFi - Send money to Mexico in 1 second',
  description: 'Instant remittance platform Mexico-USA using Monad blockchain',
  manifest: '/manifest.json',
  themeColor: '#9333ea',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="es">
      <body className={inter.className}>
        <ReownProvider cookies={cookies}>
          <KYCProvider>
            {children}
            <AIChat />
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </KYCProvider>
        </ReownProvider>
      </body>
    </html>
  )
}
