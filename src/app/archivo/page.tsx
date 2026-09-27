import type {Metadata} from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArchivoBuscador from '@/components/ArchivoBuscador'
import {getArchivoEntriesTodas} from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Archivo "El Quilmero" — Asociación Los Quilmeros',
  description: 'Todas las notas importadas del blog "El Quilmero", buscables por título.',
}

export default async function ArchivoPage() {
  const entradas = await getArchivoEntriesTodas().catch(() => [])

  return (
    <>
      <Header />
      <section className="section archivo-page">
        <div className="wrap">
          <div className="section-head">
            <h2>Archivo &quot;El Quilmero&quot;</h2>
            <a className="ver-todo" href="https://elquilmero.blogspot.com/" target="_blank" rel="noopener">
              Ir al blog original
            </a>
          </div>
          <p className="archivo-page-intro">
            Estas son las notas del blog &quot;El Quilmero&quot; que ya importamos a este sitio. Todavía no está el
            archivo completo — para ver cualquier nota que no encuentres acá, andá directo al blog original.
          </p>
          {entradas?.length ? (
            <ArchivoBuscador entradas={entradas} />
          ) : (
            <p style={{color: '#5a7186', fontSize: 14}}>
              Todavía no hay notas importadas. Se importan con <code>npm run import-blogspot</code>.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
