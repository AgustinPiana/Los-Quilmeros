import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  const docs = await client.fetch('*[_type == "efemeride" && !defined(slug.current)]{_id, titulo}')
  console.log(`${docs.length} efemérides sin slug.`)

  const usados = new Set()
  const tx = client.transaction()
  for (const doc of docs) {
    let base = slugify(doc.titulo) || 'efemeride'
    let slug = base
    let i = 2
    while (usados.has(slug)) {
      slug = `${base}-${i}`
      i += 1
    }
    usados.add(slug)
    tx.patch(doc._id, {set: {slug: {_type: 'slug', current: slug}}})
    console.log(`  ${doc._id} -> ${slug}`)
  }

  if (docs.length) await tx.commit()
  console.log('Listo.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
