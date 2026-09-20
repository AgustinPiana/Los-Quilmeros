import type {Metadata} from 'next'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {getInstitucion, getAutoridades} from '@/lib/queries'
import {urlFor} from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Institución — Asociación Los Quilmeros',
  description: 'Historia de la fundación, la bandera y su simbología, y las autoridades de la Asociación Los Quilmeros.',
}

export default async function InstitucionPage() {
  const [institucion, autoridades] = await Promise.all([
    getInstitucion().catch(() => null),
    getAutoridades().catch(() => []),
  ])

  const bandera = institucion?.bandera
    ? {src: urlFor(institucion.bandera).width(720).height(376).url(), alt: 'Bandera de la Asociación Los Quilmeros'}
    : {src: '/isotipo.png', alt: 'Bandera de la Asociación Los Quilmeros'}

  return (
    <>
      <Header />

      <section className="section institucion-page">
        <div className="wrap">
          <div className="section-head">
            <h2>Institución</h2>
          </div>

          <div className="inst-historia">
            <h3>{institucion?.historiaTitulo || 'Nuestra historia'}</h3>
            {institucion?.historia ? (
              institucion.historia
                .split('\n\n')
                .map((parrafo: string, i: number) => <p key={i}>{parrafo}</p>)
            ) : (
              <p>
                Cargá la historia de la fundación de la asociación desde el panel en <code>/studio</code> — el tipo
                de contenido &quot;Institución&quot; ya está listo.
              </p>
            )}
          </div>

          <div className="inst-bandera">
            <div className="inst-bandera-img">
              <Image src={bandera.src} alt={bandera.alt} width={720} height={376} />
            </div>
            <div className="inst-bandera-texto">
              <h3>La bandera y su simbología</h3>
              {institucion?.banderaIntro && <p className="inst-bandera-intro">{institucion.banderaIntro}</p>}
              {institucion?.simbologia?.length ? (
                <dl className="inst-simbologia">
                  {institucion.simbologia.map((s: any, i: number) => (
                    <div className="inst-simbolo" key={i}>
                      <dt>{s.elemento}</dt>
                      <dd>{s.significado}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>Cargá cada elemento de la bandera y su significado desde /studio.</p>
              )}
            </div>
          </div>

          <div className="inst-autoridades">
            <h3>Autoridades</h3>
            <div className="autoridades-grid">
              {(autoridades?.length ? autoridades : []).map((a: any, i: number) => (
                <div className="autoridad-card" key={i}>
                  <div className="autoridad-foto">
                    {a.foto ? (
                      <Image src={urlFor(a.foto).width(240).height(240).url()} alt={a.nombre} width={240} height={240} />
                    ) : (
                      <div className="autoridad-foto-placeholder">{a.nombre?.[0] || '?'}</div>
                    )}
                  </div>
                  <div className="autoridad-cargo">{a.cargo}</div>
                  <h4>{a.nombre}</h4>
                  {a.descripcion && <p>{a.descripcion}</p>}
                </div>
              ))}
            </div>
            {!autoridades?.length && (
              <p style={{color: '#5a7186', fontSize: 14}}>
                Cargá las autoridades de la asociación desde /studio y van a aparecer acá.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
