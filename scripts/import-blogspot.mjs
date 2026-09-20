// Importa TODAS las entradas de https://elquilmero.blogspot.com/ a Sanity,
// usando el feed público de Blogger (no requiere login ni API key).
//
// Uso:
//   1) npm install @sanity/client dotenv   (no están en package.json a propósito:
//      este script corre una sola vez, no hace falta cargarlo en el bundle del sitio)
//   2) Completá .env.local con SANITY_API_TOKEN (un token "Editor" generado en
//      sanity.io/manage → API → Tokens) además de las variables NEXT_PUBLIC_SANITY_*
//   3) node scripts/import-blogspot.mjs

import {createClient} from '@sanity/client'
import 'dotenv/config'

const BLOG_URL = 'https://elquilmero.blogspot.com'
const MAX_RESULTS = 150 // máximo que entrega el feed de Blogger por request

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function limpiarHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function resumen(html = '', maxLen = 220) {
  const texto = limpiarHtml(html)
  return texto.length > maxLen ? texto.slice(0, maxLen).trim() + '…' : texto
}

async function traerPagina(startIndex) {
  const url = `${BLOG_URL}/feeds/posts/default?alt=json&max-results=${MAX_RESULTS}&start-index=${startIndex}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Feed devolvió ${res.status} en start-index=${startIndex}`)
  const data = await res.json()
  return data.feed?.entry || []
}

function extraerImagen(entry) {
  const media = entry['media$thumbnail']
  if (media?.url) return media.url.replace(/\/s\d+(-c)?\//, '/s1200/')
  return null
}

function extraerUrl(entry) {
  const link = (entry.link || []).find((l) => l.rel === 'alternate')
  return link?.href || null
}

async function importarEntrada(entry) {
  const blogPostId = entry.id?.$t
  const titulo = entry.title?.$t || 'Sin título'
  const contenidoHtml = entry.content?.$t || entry.summary?.$t || ''
  const fecha = entry.published?.$t
  const etiquetas = (entry.category || []).map((c) => c.term).filter(Boolean)
  const urlOriginal = extraerUrl(entry)

  const doc = {
    _id: `archivoEntry.${Buffer.from(blogPostId).toString('base64url')}`,
    _type: 'archivoEntry',
    titulo,
    fecha,
    resumen: resumen(contenidoHtml),
    etiquetas,
    urlOriginal,
    blogPostId,
    // La imagen NO se sube automáticamente en esta versión del script (subir imágenes
    // a Sanity requiere descargarlas y hacer un asset upload por nota). Se puede sumar
    // como segunda pasada si hace falta.
  }

  await client.createOrReplace(doc)
}

async function main() {
  console.log('Importando entradas de', BLOG_URL, '...')
  let startIndex = 1
  let total = 0

  while (true) {
    const entries = await traerPagina(startIndex)
    if (!entries.length) break

    for (const entry of entries) {
      await importarEntrada(entry)
      total += 1
    }

    console.log(`  · procesadas ${total} notas (última tanda: ${entries.length})`)
    if (entries.length < MAX_RESULTS) break
    startIndex += MAX_RESULTS
  }

  console.log(`Listo. ${total} notas importadas/actualizadas en Sanity.`)
}

main().catch((err) => {
  console.error('Error en la importación:', err)
  process.exit(1)
})
