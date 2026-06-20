import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '700', '800'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: 'The Book of Caldeseio — Luis Calderón',
  description: 'Software Engineer & Data Analyst · Developer · Problem Solver · Costa Rica',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body style={{ height: '100%', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
