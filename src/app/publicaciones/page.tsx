import type {Metadata} from 'next'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {getPublicacionesTodas} from '@/lib/queries'
import {urlFor} from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Publicaciones — Asociación Los Quilmeros',
  description: 'Todas las publicaciones de la Asociación Los Quilmeros sobre la historia de Quilmes.',
}

export default async function PublicacionesPage() {
  const publicaciones = await getPublicacionesTodas().catch(() => [])

  return (
    <>
      <Header />
      <section className="section publicaciones-page">
        <div className="wrap">
          <div className="section-head">
            <h2>Publicaciones</h2>
          </div>
          <div className="publicaciones-grid">
            {(publicaciones || []).map((p: any, i: number) => (
              <a className="publicacion-card" href={`/publicaciones/${p.slug}`} key={i}>
                <div className="img">
                  {p.imagen ? (
                    <Image
                      src={urlFor(p.imagen).width(480).height(300).url()}
                      alt={p.titulo}
                      width={480}
                      height={300}
                    />
                  ) : (
                    p.titulo
                  )}
                </div>
                <div className="body">
                  <div className="cat">{p.categoria || 'Sin categoría'}</div>
                  <h3>{p.titulo}</h3>
                  <p>{p.resumen}</p>
                  <div className="fecha">
                    {new Date(p.fecha).toLocaleDateString('es-AR', {day: '2-digit', month: 'long', year: 'numeric'})}
                  </div>
                </div>
              </a>
            ))}
          </div>
          {!publicaciones?.length && (
            <p style={{color: '#5a7186', fontSize: 14}}>
              Todavía no hay publicaciones cargadas. Se pueden cargar desde <code>/studio</code>.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
