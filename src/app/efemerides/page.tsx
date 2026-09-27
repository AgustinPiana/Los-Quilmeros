import type {Metadata} from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {getEfemeridesTodas} from '@/lib/queries'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export const metadata: Metadata = {
  title: 'Calendario de efemérides — Asociación Los Quilmeros',
  description: 'Todas las efemérides de la historia de Quilmes, organizadas por mes.',
}

export default async function EfemeridesPage() {
  const efemerides = await getEfemeridesTodas().catch(() => [])

  const porMes: Record<number, any[]> = {}
  for (const e of efemerides || []) {
    if (!porMes[e.mes]) porMes[e.mes] = []
    porMes[e.mes].push(e)
  }

  return (
    <>
      <Header />
      <section className="section efemerides-page">
        <div className="wrap">
          <div className="section-head">
            <h2>Calendario de efemérides</h2>
          </div>
          {efemerides?.length ? (
            <div className="efem-meses">
              {MESES.map((nombreMes, i) => {
                const mesNum = i + 1
                const items = porMes[mesNum]
                if (!items?.length) return null
                return (
                  <div className="efem-mes-grupo" key={mesNum}>
                    <h3>{nombreMes[0].toUpperCase() + nombreMes.slice(1)}</h3>
                    <div className="efem-mes-lista">
                      {items.map((e: any, j: number) => (
                        <a className="efem-mes-item" href={`/efemerides/${e.slug}`} key={j}>
                          <div className="d">{e.dia}</div>
                          <div>
                            <h4>{e.anioHistorico ? `${e.anioHistorico} — ` : ''}{e.titulo}</h4>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{color: '#5a7186', fontSize: 14}}>
              Todavía no hay efemérides cargadas. Se pueden cargar desde <code>/studio</code>.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
