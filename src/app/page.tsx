import {getPublicaciones, getEfemeridesDeHoy, getEfemeridesDelMes, getArchivoEntries} from '@/lib/queries'
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
  const [publicaciones, efemeridesHoy, efemeridesMes, archivo] = await Promise.all([
    getPublicaciones().catch(() => ({destacada: null, recientes: []})),
    getEfemeridesDeHoy(dia, mes).catch(() => []),
    getEfemeridesDelMes(mes).catch(() => []),
    getArchivoEntries(6).catch(() => []),
  ])

  const efemerideDestacada = efemeridesHoy?.[0]
  const celdasDelMes = armarCeldasDelMes(hoy.getFullYear(), hoy.getMonth())
  const diasConEfemeride = new Set((efemeridesMes || []).map((e: any) => e.dia))

  return (
    <>
      <Header />

      <section className="hero" id="inicio">
        <div className="wrap hero-grid">
          <div>
            <h1>La historia de<br />Quilmes, viva.</h1>
            <div className="chain-rule">
              <svg viewBox="0 0 120 12" width="120"><g fill="none" stroke="#A22929" strokeWidth={2.2}><ellipse cx="8" cy="6" rx="6" ry="4" /><ellipse cx="20" cy="6" rx="6" ry="4" /><ellipse cx="32" cy="6" rx="6" ry="4" /><ellipse cx="44" cy="6" rx="6" ry="4" /></g></svg>
            </div>
            <p className="lead">
              Somos la Agrupación Los Quilmeros, un grupo de historiadores dedicado a investigar y difundir la
              historia del partido de Quilmes. Este espacio reúne nuestras publicaciones, un calendario de
              efemérides locales y el archivo completo de &quot;El Quilmero&quot;.
            </p>
            <a className="hero-cta" href="#footer">Sumate a la asociación</a>
          </div>

          <div className="fecha-card">
            <div className="tag">Una fecha para recordar</div>
            {efemerideDestacada ? (
              <>
                <div className="fecha-num">{dia} de {MESES[mes - 1]}</div>
                {efemerideDestacada.anioHistorico && (
                  <div className="fecha-desc">{efemerideDestacada.anioHistorico}</div>
                )}
                <div className="fecha-titulo">{efemerideDestacada.titulo}</div>
                <p className="fecha-cuerpo">{efemerideDestacada.texto}</p>
              </>
            ) : (
              <>
                <div className="fecha-num">Sin efeméride cargada</div>
                <div className="fecha-titulo">Todavía no hay una efeméride para el {dia} de {MESES[mes - 1]}</div>
                <p className="fecha-cuerpo">
                  Cargalas desde el panel en <code>/studio</code> — el tipo de contenido &quot;Efeméride&quot; ya está listo.
                </p>
              </>
            )}
            <a className="fecha-link" href="#efemerides">Ver el calendario completo</a>
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
            <a className="ver-todo" href="#">Ver todas las publicaciones</a>
          </div>
          <div className="pub-grid">
            <article className="pub-principal">
              <div className="img">{publicaciones?.destacada ? publicaciones.destacada.titulo : 'Cargá una publicación destacada desde /studio'}</div>
              <div className="body">
                <div className="cat">{publicaciones?.destacada?.categoria || 'Sin categoría'}</div>
                <h3>{publicaciones?.destacada?.titulo || 'Todavía no hay una publicación destacada'}</h3>
                <p>{publicaciones?.destacada?.resumen || 'Marcá una publicación como destacada en el panel para que aparezca acá.'}</p>
              </div>
            </article>
            <div className="pub-lista">
              {(publicaciones?.recientes?.length ? publicaciones.recientes : []).map((p: any, i: number) => (
                <div className="pub-item" key={i}>
                  <div className="fecha">{new Date(p.fecha).toLocaleDateString('es-AR', {day: '2-digit', month: 'short'})}</div>
                  <div>
                    <h4>{p.titulo}</h4>
                    <p>{p.resumen}</p>
                  </div>
                </div>
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
            <a className="ver-todo" href="#">Ver calendario completo</a>
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
              {(efemeridesMes?.length ? efemeridesMes : []).slice(0, 5).map((e: any, i: number) => (
                <div className="item" key={i}>
                  <div className="d">{e.dia} {MESES[e.mes - 1].slice(0, 3)}</div>
                  <div>
                    <h4>{e.anioHistorico ? `${e.anioHistorico} — ` : ''}{e.titulo}</h4>
                  </div>
                </div>
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
              <div className="fmark">f</div>
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
          </div>
        </div>
      </div>

      <div className="archivo-wrap section" id="archivo">
        <div className="wrap">
          <div className="section-head">
            <h2>Archivo &quot;El Quilmero&quot;</h2>
            <a className="ver-todo" href="https://elquilmero.blogspot.com/" target="_blank" rel="noopener">Ir al blog original</a>
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
