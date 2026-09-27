import type {MetadataRoute} from 'next'
import {client} from '@/lib/sanity'

const BASE_URL = 'https://losquilmeros.com.ar'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publicaciones, efemerides] = await Promise.all([
    client
      .fetch<{slug: string}[]>(`*[_type == "publicacion" && defined(slug.current)]{"slug": slug.current}`)
      .catch(() => []),
    client
      .fetch<{slug: string}[]>(`*[_type == "efemeride" && defined(slug.current)]{"slug": slug.current}`)
      .catch(() => []),
  ])

  return [
    {url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1},
    {url: `${BASE_URL}/institucion`, changeFrequency: 'monthly'},
    {url: `${BASE_URL}/publicaciones`, changeFrequency: 'weekly'},
    {url: `${BASE_URL}/efemerides`, changeFrequency: 'monthly'},
    {url: `${BASE_URL}/archivo`, changeFrequency: 'monthly'},
    ...publicaciones.map((p) => ({url: `${BASE_URL}/publicaciones/${p.slug}`, changeFrequency: 'monthly' as const})),
    ...efemerides.map((e) => ({url: `${BASE_URL}/efemerides/${e.slug}`, changeFrequency: 'yearly' as const})),
  ]
}
