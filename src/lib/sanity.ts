import {createClient} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Si falta la variable de entorno, usamos un projectId inválido en vez de uno vacío:
// createClient() explota al instanciarse si projectId es '', lo cual tira abajo todo el
// build. Con un valor placeholder, el cliente se crea igual y son las consultas
// individuales (ya envueltas en .catch() en cada página) las que fallan de forma controlada.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sin-configurar',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}
