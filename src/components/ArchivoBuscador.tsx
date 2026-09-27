'use client'

import {useMemo, useState} from 'react'

type Entrada = {
  titulo: string
  resumen: string
  fecha: string
  etiquetas: string[]
  urlOriginal: string
}

const MOSTRAR_POR_DEFECTO = 24
const MOSTRAR_MAX_BUSQUEDA = 60

export default function ArchivoBuscador({entradas}: {entradas: Entrada[]}) {
  const [busqueda, setBusqueda] = useState('')

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return entradas.slice(0, MOSTRAR_POR_DEFECTO)
    return entradas.filter((e) => e.titulo?.toLowerCase().includes(q)).slice(0, MOSTRAR_MAX_BUSQUEDA)
  }, [busqueda, entradas])

  return (
    <div>
      <div className="archivo-buscador">
        <input
          type="text"
          placeholder="Buscar por título…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar en el archivo de El Quilmero por título"
        />
      </div>

      <p className="archivo-buscador-resultado">
        {busqueda.trim()
          ? `${filtradas.length} resultado${filtradas.length === 1 ? '' : 's'} para "${busqueda}"`
          : `Mostrando las ${filtradas.length} notas más recientes de ${entradas.length} en total`}
      </p>

      <div className="archivo-grid">
        {filtradas.map((a, i) => (
          <div className="archivo-card" key={i}>
            <div className="etiqueta">{a.etiquetas?.join(' · ') || 'Sin etiqueta'}</div>
            <h4>{a.titulo}</h4>
            <p>{a.resumen}</p>
            <div className="fuente">
              <span>El Quilmero{a.fecha ? `, ${new Date(a.fecha).getFullYear()}` : ''}</span>
              <a href={a.urlOriginal} target="_blank" rel="noopener">
                Leer nota
              </a>
            </div>
          </div>
        ))}
      </div>

      {!filtradas.length && (
        <p className="archivo-note">No encontramos ninguna nota con ese título. Probá con otra palabra.</p>
      )}
    </div>
  )
}
