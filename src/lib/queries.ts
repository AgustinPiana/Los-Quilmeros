import {client} from './sanity'

// Sin esto, Next.js puede guardar en caché el resultado de una consulta (por ejemplo,
// "no hay publicaciones todavía") y seguir mostrándolo aunque después cargues contenido
// nuevo en /studio. no-store fuerza a traer siempre la última versión.
const SIN_CACHE = {cache: 'no-store' as const}

// Trae la publicación destacada + las últimas para la home.
export async function getPublicaciones() {
  return client.fetch(
    `{
    "destacada": *[_type == "publicacion" && destacada == true] | order(fecha desc)[0]{
      titulo, "slug": slug.current, resumen, fecha, categoria, imagen
    },
    "recientes": *[_type == "publicacion" && destacada != true] | order(fecha desc)[0...5]{
      titulo, "slug": slug.current, resumen, fecha, categoria
    }
  }`,
    {},
    SIN_CACHE
  )
}

// Todas las publicaciones, para la página de listado completo.
export async function getPublicacionesTodas() {
  return client.fetch(
    `*[_type == "publicacion"] | order(fecha desc){
      titulo, "slug": slug.current, resumen, fecha, categoria, imagen
    }`,
    {},
    SIN_CACHE
  )
}

// Una publicación puntual, para la página de detalle.
export async function getPublicacionPorSlug(slug: string) {
  return client.fetch(
    `*[_type == "publicacion" && slug.current == $slug][0]{
      titulo, "slug": slug.current, resumen, fecha, categoria, imagen, cuerpo
    }`,
    {slug},
    SIN_CACHE
  )
}

// Todas las efemérides del mes indicado, para pintar el calendario.
export async function getEfemeridesDelMes(mes: number) {
  return client.fetch(
    `*[_type == "efemeride" && mes == $mes] | order(dia asc){
      dia, mes, titulo, "slug": slug.current, anioHistorico, categoria
    }`,
    {mes},
    SIN_CACHE
  )
}

// Todas las efemérides del año, agrupables por mes, para la página de listado completo.
export async function getEfemeridesTodas() {
  return client.fetch(
    `*[_type == "efemeride"] | order(mes asc, dia asc){
      dia, mes, titulo, "slug": slug.current, anioHistorico, categoria
    }`,
    {},
    SIN_CACHE
  )
}

// Una efeméride puntual, para la página de detalle.
export async function getEfemeridePorSlug(slug: string) {
  return client.fetch(
    `*[_type == "efemeride" && slug.current == $slug][0]{
      dia, mes, titulo, "slug": slug.current, anioHistorico, categoria, imagen, texto
    }`,
    {slug},
    SIN_CACHE
  )
}

// Últimas entradas importadas del blogspot, para la sección Archivo de la home.
export async function getArchivoEntries(cantidad = 6) {
  return client.fetch(
    `*[_type == "archivoEntry"] | order(fecha desc)[0...$cantidad]{
      titulo, resumen, fecha, etiquetas, urlOriginal, imagen
    }`,
    {cantidad},
    SIN_CACHE
  )
}

// Todas las entradas importadas, para la página de listado + buscador del Archivo.
export async function getArchivoEntriesTodas() {
  return client.fetch(
    `*[_type == "archivoEntry"] | order(fecha desc){
      titulo, resumen, fecha, etiquetas, urlOriginal
    }`,
    {},
    SIN_CACHE
  )
}

// Historia de la fundación + bandera y su simbología. Documento único.
export async function getInstitucion() {
  return client.fetch(
    `*[_type == "institucion"][0]{
      historiaTitulo, historia, bandera, banderaIntro, simbologia
    }`,
    {},
    SIN_CACHE
  )
}

// Listado de autoridades, ordenadas manualmente desde /studio.
export async function getAutoridades() {
  return client.fetch(
    `*[_type == "autoridad"] | order(orden asc){
      nombre, cargo, foto, descripcion
    }`,
    {},
    SIN_CACHE
  )
}
