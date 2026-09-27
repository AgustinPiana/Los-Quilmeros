import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {getEfemeridePorSlug} from '@/lib/queries'
import {urlFor} from '@/lib/sanity'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const CATEGORIAS: Record<string, string> = {
  fundacional: 'Fundacional',
  institucional: 'Institucional',
  personalidades: 'Personalidades',
  patrimonio: 'Patrimonio',
  barrios: 'Barrios y localidades',
  otra: 'Otra',
}

export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {
  const efemeride = await getEfemeridePorSlug(params.slug).catch(() => null)
  return {
    title: efemeride ? `${efemeride.titulo} — Asociación Los Quilmeros` : 'Efeméride — Asociación Los Quilmeros',
  }
}

export default async function EfemeridePage({params}: {params: {slug: string}}) {
  const efemeride = await getEfemeridePorSlug(params.slug).catch(() => null)
  if (!efemeride) notFound()

  return (
    <>
      <Header />
      <article className="section publicacion-detalle">
        <div className="wrap wrap-angosto">
          <a className="volver" href="/efemerides">
            ← Volver al calendario
          </a>
          <div className="cat">{CATEGORIAS[efemeride.categoria] || 'Sin categoría'}</div>
          <h1>{efemeride.titulo}</h1>
          <div className="fecha">
            {efemeride.dia} de {MESES[efemeride.mes - 1]}
            {efemeride.anioHistorico ? ` · ${efemeride.anioHistorico}` : ''}
          </div>
          {efemeride.imagen && (
            <div className="imagen-principal">
              <Image
                src={urlFor(efemeride.imagen).width(1200).height(675).url()}
                alt={efemeride.titulo}
                width={1200}
                height={675}
              />
            </div>
          )}
          <div className="cuerpo">
            {efemeride.texto.split('\n\n').map((parrafo: string, i: number) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}
