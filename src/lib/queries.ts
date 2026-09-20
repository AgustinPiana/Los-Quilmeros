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
      titulo, resumen, fecha, categoria, imagen
    },
    "recientes": *[_type == "publicacion" && destacada != true] | order(fecha desc)[0...5]{
      titulo, resumen, fecha, categoria
    }
  }`,
    {},
    SIN_CACHE
  )
}

// Trae la/las efemérides de HOY (comparando día y mes, no el año), más las próximas del mes actual.
export async function getEfemeridesDeHoy(dia: number, mes: number) {
  return client.fetch(
    `*[_type == "efemeride" && dia == $dia && mes == $mes]{
      titulo, texto, anioHistorico, categoria, imagen
    }`,
    {dia, mes},
    SIN_CACHE
  )
}

// Todas las efemérides del mes indicado, para pintar el calendario.
export async function getEfemeridesDelMes(mes: number) {
  return client.fetch(
    `*[_type == "efemeride" && mes == $mes] | order(dia asc){
      dia, mes, titulo, anioHistorico, categoria
    }`,
    {mes},
    SIN_CACHE
  )
}

// Últimas entradas importadas del blogspot, para la sección Archivo.
export async function getArchivoEntries(cantidad = 6) {
  return client.fetch(
    `*[_type == "archivoEntry"] | order(fecha desc)[0...$cantidad]{
      titulo, resumen, fecha, etiquetas, urlOriginal, imagen
    }`,
    {cantidad},
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
