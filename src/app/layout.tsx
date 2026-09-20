import type {Metadata} from 'next'
import {Libre_Baskerville, Montserrat} from 'next/font/google'
import './globals.css'

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Asociación Los Quilmeros',
  description: 'Investigación, historia y patrimonio del partido de Quilmes.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body className={`${baskerville.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  )
}
