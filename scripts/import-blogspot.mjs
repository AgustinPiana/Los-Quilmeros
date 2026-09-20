// Importa TODAS las entradas de https://elquilmero.blogspot.com/ a Sanity.
//
// El feed clásico de Blogger (feeds/posts/default) fue dado de baja por Google, así que
// esta versión recorre el sitemap.xml del blog (que Blogger sigue generando) y extrae
// título/fecha/etiquetas/contenido/imagen directamente del HTML de cada nota.
//
// Uso:
//   1) npm install (ya deja instalados @sanity/client y dotenv como devDependencies)
//   2) Completá .env.local con SANITY_API_TOKEN (un token "Editor" generado en
//      sanity.io/manage → API → Tokens) además de las variables NEXT_PUBLIC_SANITY_*
//   3) node scripts/import-blogspot.mjs

import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const BLOG_URL = 'https://elquilmero.blogspot.com'
const CONCURRENCIA = 8

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function decodeEntities(texto = '') {
  return texto
    .replace(/&#(\d+);/g, (_, cod) => String.fromCharCode(Number(cod)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function limpiarHtml(html = '') {
  const sinRuido = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ') // CSS embebido (a veces con metadata de Word)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ') // comentarios HTML y bloques condicionales de Word (mso)
  return decodeEntities(sinRuido.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

function resumen(html = '', maxLen = 220) {
  const texto = limpiarHtml(html)
  if (!texto) return 'Nota con contenido multimedia (foto o video) — ver la nota completa.'
  return texto.length > maxLen ? texto.slice(0, maxLen).trim() + '…' : texto
}

async function obtenerUrlsDeNotas() {
  const indexRes = await fetch(`${BLOG_URL}/sitemap.xml`)
  if (!indexRes.ok) throw new Error(`No se pudo leer sitemap.xml (${indexRes.status})`)
  const indexXml = await indexRes.text()
  const paginas = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

  const urls = []
  for (const paginaUrl of paginas) {
    const res = await fetch(paginaUrl)
    if (!res.ok) {
      console.warn(`  ! no se pudo leer ${paginaUrl} (${res.status})`)
      continue
    }
    const xml = await res.text()
    const encontradas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    urls.push(...encontradas)
  }
  return urls
}

function extraerCampo(html, regex) {
  const match = html.match(regex)
  return match ? match[1] : null
}

async function importarNota(url) {
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`  ! ${url} devolvió ${res.status}, se salteó`)
    return false
  }
  const html = await res.text()

  const blogPostId = extraerCampo(html, /id=['"]post-body-(\d+)['"]/)
  if (!blogPostId) {
    console.warn(`  ! no se encontró post-body en ${url}, se salteó`)
    return false
  }

  const tituloHtml = extraerCampo(
    html,
    /class=['"]post-title entry-title['"][^>]*itemprop=['"]name['"][^>]*>([\s\S]*?)<\/h3>/
  )
  const titulo = tituloHtml ? decodeEntities(tituloHtml.replace(/<[^>]+>/g, '').trim()) : 'Sin título'

  const fecha = extraerCampo(html, /class=['"]published['"][^>]*itemprop=['"]datePublished['"][^>]*title=['"]([^'"]+)['"]/)

  // Se corta justo antes del pie de la nota (post-footer), donde Blogger mete los botones
  // de compartir y el "Publicado por..." — si no, en notas muy cortas (una sola foto) el
  // resumen terminaba agarrando ese texto de relleno en vez de contenido real.
  const cuerpoHtml = extraerCampo(
    html,
    new RegExp(`id=['"]post-body-${blogPostId}['"][^>]*>([\\s\\S]*?)<div class=['"]post-footer['"]`)
  )

  const etiquetas = [...html.matchAll(/rel=['"]tag['"][^>]*>([^<]*)</g)]
    .map((m) => decodeEntities(m[1].trim()))
    .filter(Boolean)

  // La imagen NO se sube en esta pasada (requeriría descargar y subir cada asset a Sanity
  // uno por uno). Se puede sumar como segunda pasada si hace falta más adelante.
  const doc = {
    // Sin punto en el id: un "." en el _id lo trata como documento versionado/de un
    // release en el content lake de Sanity, y queda invisible para lecturas públicas.
    _id: `archivoEntry-${Buffer.from(blogPostId).toString('base64url')}`,
    _type: 'archivoEntry',
    titulo,
    fecha: fecha || undefined,
    resumen: resumen(cuerpoHtml || ''),
    etiquetas,
    urlOriginal: url,
    blogPostId,
  }

  await client.createOrReplace(doc)
  return true
}

async function procesarEnTandas(urls, tamanioTanda, fn) {
  let ok = 0
  let error = 0
  for (let i = 0; i < urls.length; i += tamanioTanda) {
    const tanda = urls.slice(i, i + tamanioTanda)
    const resultados = await Promise.allSettled(tanda.map(fn))
    for (const r of resultados) {
      if (r.status === 'fulfilled' && r.value) ok += 1
      else error += 1
    }
    console.log(`  · procesadas ${Math.min(i + tamanioTanda, urls.length)}/${urls.length} (ok: ${ok}, error/salteadas: ${error})`)
  }
  return {ok, error}
}

async function main() {
  let urls
  if (process.env.TEST_URLS) {
    urls = process.env.TEST_URLS.split(',')
  } else {
    console.log('Leyendo sitemap de', BLOG_URL, '...')
    urls = await obtenerUrlsDeNotas()
    if (process.env.IMPORT_LIMIT) urls = urls.slice(0, Number(process.env.IMPORT_LIMIT))
  }
  console.log(`Encontradas ${urls.length} notas. Importando a Sanity...`)

  const {ok, error} = await procesarEnTandas(urls, CONCURRENCIA, importarNota)

  console.log(`Listo. ${ok} notas importadas/actualizadas en Sanity (${error} salteadas por error).`)
}

main().catch((err) => {
  console.error('Error en la importación:', err)
  process.exit(1)
})
