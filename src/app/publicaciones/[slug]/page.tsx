import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {getPublicacionPorSlug} from '@/lib/queries'
import {urlFor} from '@/lib/sanity'

export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {
  const publicacion = await getPublicacionPorSlug(params.slug).catch(() => null)
  return {
    title: publicacion ? `${publicacion.titulo} — Asociación Los Quilmeros` : 'Publicación — Asociación Los Quilmeros',
    description: publicacion?.resumen,
  }
}

export default async function PublicacionPage({params}: {params: {slug: string}}) {
  const publicacion = await getPublicacionPorSlug(params.slug).catch(() => null)
  if (!publicacion) notFound()

  return (
    <>
      <Header />
      <article className="section publicacion-detalle">
        <div className="wrap wrap-angosto">
          <a className="volver" href="/publicaciones">
            ← Volver a publicaciones
          </a>
          <div className="cat">{publicacion.categoria || 'Sin categoría'}</div>
          <h1>{publicacion.titulo}</h1>
          <div className="fecha">
            {new Date(publicacion.fecha).toLocaleDateString('es-AR', {day: '2-digit', month: 'long', year: 'numeric'})}
          </div>
          {publicacion.imagen && (
            <div className="imagen-principal">
              <Image
                src={urlFor(publicacion.imagen).width(1200).height(675).url()}
                alt={publicacion.titulo}
                width={1200}
                height={675}
              />
            </div>
          )}
          {publicacion.cuerpo?.length ? (
            <div className="cuerpo">
              <PortableText value={publicacion.cuerpo} />
            </div>
          ) : (
            <p className="resumen-solo">{publicacion.resumen}</p>
          )}
        </div>
      </article>
      <Footer />
    </>
  )
}
