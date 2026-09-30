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
  metadataBase: new URL('https://losquilmeros.com.ar'),
  title: 'Asociación Los Quilmeros',
  description: 'Investigación, historia y patrimonio del partido de Quilmes.',
  openGraph: {
    title: 'Asociación Los Quilmeros',
    description: 'Investigación, historia y patrimonio del partido de Quilmes.',
    url: '/',
    siteName: 'Asociación Los Quilmeros',
    locale: 'es_AR',
    type: 'website',
    images: ['/isotipo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const datosEstructurados = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Asociación Los Quilmeros',
  alternateName: 'Agrupación Los Quilmeros',
  url: 'https://losquilmeros.com.ar',
  logo: 'https://losquilmeros.com.ar/isotipo.png',
  description: 'Investigación, historia y patrimonio del partido de Quilmes.',
  sameAs: [
    'https://www.facebook.com/groups/589317591242180/',
    'https://www.instagram.com/ah_losquilmeros/',
  ],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(datosEstructurados)}}
        />
      </head>
      <body className={`${baskerville.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  )
}
