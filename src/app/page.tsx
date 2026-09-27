import Image from 'next/image'
import {getPublicaciones, getEfemeridesDelMes, getArchivoEntries} from '@/lib/queries'
import {urlFor} from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const DIAS_SEMANA = ['L','M','M','J','V','S','D']

// Arma la grilla del mes (con huecos vacíos antes del día 1) para dibujar el calendario.
// getDay() de JS da 0=domingo..6=sábado; lo convertimos a 0=lunes..6=domingo.
function armarCeldasDelMes(anio: number, mesIndex: number) {
  const primerDia = new Date(anio, mesIndex, 1)
  const diasEnMes = new Date(anio, mesIndex + 1, 0).getDate()
  const offset = (primerDia.getDay() + 6) % 7 // lunes=0
  const celdas: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)
  return celdas
}

export default async function Home() {
  const hoy = new Date()
  const dia = hoy.getDate()
  const mes = hoy.getMonth() + 1

  // Si Sanity todavía no tiene contenido cargado, cada función devuelve vacío/null
  // y la página cae en los textos de reserva de abajo (no rompe el sitio).
  const [publicaciones, efemeridesMes, archivo] = await Promise.all([
    getPublicaciones().catch(() => ({destacada: null, recientes: []})),
    getEfemeridesDelMes(mes).catch(() => []),
    getArchivoEntries(6).catch(() => []),
  ])

  const celdasDelMes = armarCeldasDelMes(hoy.getFullYear(), hoy.getMonth())
  const diasConEfemeride = new Set((efemeridesMes || []).map((e: any) => e.dia))

  return (
    <>
      <Header />

      <section className="hero" id="inicio">
        <div className="hero-bg" style={{backgroundImage: "url('/hero-quilmes.webp')"}} />
        <div className="wrap hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <svg viewBox="0 0 40 12" width="40" height="12"><g fill="none" stroke="#A22929" strokeWidth={2.2}><ellipse cx="6" cy="6" rx="5" ry="4" /><ellipse cx="16" cy="6" rx="5" ry="4" /><ellipse cx="26" cy="6" rx="5" ry="4" /></g></svg>
              <span className="label">Memoria e identidad local</span>
              <span className="rule" />
            </div>
            <h1>La historia de Quilmes, viva.</h1>
            <p className="lead">
              Somos la Agrupación Los Quilmeros, un grupo de historiadores dedicado a investigar y difundir la
              historia del partido de Quilmes. Este espacio reúne nuestras publicaciones, un calendario de
              efemérides locales y el archivo completo de &quot;El Quilmero&quot;.
            </p>
          </div>
          <div className="hero-actions">
            <a
              className="hero-cta"
              href="https://www.facebook.com/groups/589317591242180/"
              target="_blank"
              rel="noopener"
            >
              Sumate a la asociación →
            </a>
            <a className="hero-cta-secondary" href="/publicaciones">Ver nuestras publicaciones</a>
          </div>
        </div>
      </section>

      <div className="wave-divider">
        <svg viewBox="0 0 1200 26" preserveAspectRatio="none">
          <path d="M0 13 Q 25 3 50 13 T 100 13 T 150 13 T 200 13 T 250 13 T 300 13 T 350 13 T 400 13 T 450 13 T 500 13 T 550 13 T 600 13 T 650 13 T 700 13 T 750 13 T 800 13 T 850 13 T 900 13 T 950 13 T 1000 13 T 1050 13 T 1100 13 T 1150 13 T 1200 13" fill="none" stroke="#1268A8" strokeWidth={2} opacity={0.55} />
        </svg>
      </div>

      <section className="section" id="publicaciones">
        <div className="wrap">
          <div className="section-head">
            <h2>Publicaciones</h2>
            <a className="ver-todo" href="/publicaciones">Ver todas las publicaciones</a>
          </div>
          <div className="pub-grid">
            {publicaciones?.destacada ? (
              <a className="pub-principal" href={`/publicaciones/${publicaciones.destacada.slug}`}>
                <div className="img">
                  {publicaciones.destacada.imagen ? (
                    <Image
                      src={urlFor(publicaciones.destacada.imagen).width(760).height(428).url()}
                      alt={publicaciones.destacada.titulo}
                      width={760}
                      height={428}
                    />
                  ) : (
                    publicaciones.destacada.titulo
                  )}
                </div>
                <div className="body">
                  <div className="cat">{publicaciones.destacada.categoria || 'Sin categoría'}</div>
                  <h3>{publicaciones.destacada.titulo}</h3>
                  <p>{publicaciones.destacada.resumen}</p>
                </div>
              </a>
            ) : (
              <article className="pub-principal">
                <div className="img">Cargá una publicación destacada desde /studio</div>
                <div className="body">
                  <div className="cat">Sin categoría</div>
                  <h3>Todavía no hay una publicación destacada</h3>
                  <p>Marcá una publicación como destacada en el panel para que aparezca acá.</p>
                </div>
              </article>
            )}
            <div className="pub-lista">
              {(publicaciones?.recientes?.length ? publicaciones.recientes : []).map((p: any, i: number) => (
                <a className="pub-item" href={`/publicaciones/${p.slug}`} key={i}>
                  <div className="fecha">{new Date(p.fecha).toLocaleDateString('es-AR', {day: '2-digit', month: 'short'})}</div>
                  <div>
                    <h4>{p.titulo}</h4>
                    <p>{p.resumen}</p>
                  </div>
                </a>
              ))}
              {!publicaciones?.recientes?.length && (
                <p style={{color: '#5a7186', fontSize: 14}}>Las próximas publicaciones que cargues van a aparecer acá.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="efem-wrap" id="efemerides">
        <div className="wrap">
          <div className="section-head">
            <h2>Calendario de efemérides</h2>
            <a className="ver-todo" href="/efemerides">Ver calendario completo</a>
          </div>
          <div className="efem-grid">
            <div className="calendario">
              <div className="mes">{MESES[mes - 1][0].toUpperCase() + MESES[mes - 1].slice(1)}</div>
              <div className="cal-grid">
                {DIAS_SEMANA.map((d, i) => (
                  <div className="dow" key={`dow-${i}`}>{d}</div>
                ))}
                {celdasDelMes.map((d, i) => {
                  if (d === null) return <div className="day empty" key={`empty-${i}`}></div>
                  const esHoy = d === dia
                  const tieneEfemeride = diasConEfemeride.has(d)
                  const clases = ['day']
                  if (tieneEfemeride) clases.push('marked')
                  if (esHoy) clases.push('today')
                  return <div className={clases.join(' ')} key={d}>{d}</div>
                })}
              </div>
            </div>
            <div className="efem-lista">
              {(efemeridesMes?.length ? efemeridesMes : []).slice(0, 4).map((e: any, i: number) => (
                <a className="item" href={`/efemerides/${e.slug}`} key={i}>
                  <div className="d">{e.dia} {MESES[e.mes - 1].slice(0, 3)}</div>
                  <div>
                    <h4>{e.anioHistorico ? `${e.anioHistorico} — ` : ''}{e.titulo}</h4>
                  </div>
                </a>
              ))}
              {!efemeridesMes?.length && (
                <p style={{color: 'rgba(245,241,232,.7)', fontSize: 14}}>
                  Cargá la primera desde <code>/studio</code> y va a aparecer acá y en el calendario.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="redes-wrap" id="redes">
        <div className="wrap">
          <div className="redes-head">
            <div>
              <div className="tag">En las redes</div>
              <h2>Sumate a nuestro grupo de Facebook</h2>
              <p>Compartimos novedades, fotos de archivo y charlas sobre la historia de Quilmes con la comunidad.</p>
            </div>
          </div>
          <div className="redes-body">
            <div className="fb-cta-card" style={{gridColumn: '1 / -1'}}>
              <div className="fmark">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" aria-hidden="true">
                  <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                </svg>
              </div>
              <div className="fb-cta-texto">
                <strong>Asociación Los Quilmeros</strong>
                <p>Grupo público en Facebook, con más de 800 integrantes.</p>
              </div>
              <a
                className="fb-cta-btn"
                href="https://www.facebook.com/groups/589317591242180/"
                target="_blank"
                rel="noopener"
              >
                Unirme al grupo
              </a>
            </div>

            <div className="redes-iconos" style={{gridColumn: '1 / -1'}}>
              <a
                className="red-icono"
                href="https://www.instagram.com/ah_losquilmeros/"
                target="_blank"
                rel="noopener"
              >
                <span className="red-icono-mark ig">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden="true">
                    <path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.21 1.85.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.13.36.29.88.34 1.85.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.21 1.5-.34 1.85-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.13-.88.29-1.85.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.21-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.13-.36-.29-.88-.34-1.85-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.21-1.5.34-1.85.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.13.88-.29 1.85-.34C9.01 3.81 9.33 3.8 12 3.8Zm0 3.06a5.14 5.14 0 1 0 0 10.28 5.14 5.14 0 0 0 0-10.28Zm0 8.48a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68Zm5.34-8.68a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
                  </svg>
                </span>
                <span>Instagram</span>
              </a>
              <a
                className="red-icono"
                href="https://www.facebook.com/groups/589317591242180/"
                target="_blank"
                rel="noopener"
                title="Todavía no tenemos WhatsApp — por ahora te lleva al grupo de Facebook"
              >
                <span className="red-icono-mark wa">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden="true">
                    <path d="M17.47 14.38c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.2.05-.37-.02-.51-.07-.15-.65-1.56-.89-2.14-.24-.57-.47-.49-.65-.5h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.4 0 1.4 1.02 2.76 1.17 2.95.15.19 2.01 3.07 4.88 4.31.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34ZM12.02 21.8h-.01a9.8 9.8 0 0 1-5-1.36l-.36-.21-3.71.97.99-3.62-.24-.37a9.75 9.75 0 0 1-1.5-5.21C2.2 6.6 6.6 2.2 12.02 2.2c2.61 0 5.06 1.02 6.9 2.86a9.7 9.7 0 0 1 2.86 6.9c0 5.42-4.4 9.84-9.76 9.84Zm8.32-18.16A11.6 11.6 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.97c0 2.1.55 4.16 1.6 5.98L0 24l6.2-1.62a11.95 11.95 0 0 0 5.82 1.48h.01c6.62 0 12-5.36 12-11.97a11.9 11.9 0 0 0-3.5-8.24Z" />
                  </svg>
                </span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="archivo-wrap section" id="archivo">
        <div className="wrap">
          <div className="section-head">
            <h2>Archivo &quot;El Quilmero&quot;</h2>
            <a className="ver-todo" href="/archivo">Ver todas las publicaciones del archivo</a>
          </div>
          <div className="archivo-grid">
            {(archivo?.length ? archivo : []).map((a: any, i: number) => (
              <div className="archivo-card" key={i}>
                <div className="etiqueta">{a.etiquetas?.join(' · ') || 'Sin etiqueta'}</div>
                <h4>{a.titulo}</h4>
                <p>{a.resumen}</p>
                <div className="fuente">
                  <span>El Quilmero{a.fecha ? `, ${new Date(a.fecha).getFullYear()}` : ''}</span>
                  <a href={a.urlOriginal} target="_blank" rel="noopener">Leer nota</a>
                </div>
              </div>
            ))}
          </div>
          {!archivo?.length && (
            <p className="archivo-note">
              Todavía no corriste el script de importación (<code>npm run import-blogspot</code>). Cuando lo corras,
              las notas del blogspot van a aparecer acá automáticamente.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
