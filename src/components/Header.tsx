'use client'

import {useState} from 'react'
import Image from 'next/image'

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const cerrar = () => setAbierto(false)

  return (
    <header>
      <div className="header-inner">
        <a className="brand" href="/">
          <Image
            src="/isotipo.png"
            alt="Isotipo Asociación Los Quilmeros"
            width={720}
            height={376}
            priority
          />
          <div className="brand-text">
            <div className="eyebrow">Asociación</div>
            <div className="name">Los Quilmeros</div>
          </div>
        </a>
        <nav className={abierto ? 'nav-abierto' : ''}>
          <a href="/#publicaciones" onClick={cerrar}>Publicaciones</a>
          <a href="/#efemerides" onClick={cerrar}>Efemérides</a>
          <a href="/#redes" onClick={cerrar}>Redes</a>
          <a href="/institucion" onClick={cerrar}>Institución</a>
          <a href="/#archivo" onClick={cerrar}>Archivo El Quilmero</a>
        </nav>
        <div className="header-actions">
          <a className="login-btn" href="/studio">Iniciar sesión</a>
          <button
            className="menu-btn"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
