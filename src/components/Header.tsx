import Image from 'next/image'

export default function Header() {
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
        <nav>
          <a href="/institucion">Institución</a>
          <a href="/#publicaciones">Publicaciones</a>
          <a href="/#efemerides">Efemérides</a>
          <a href="/#redes">Redes</a>
          <a href="/#archivo">Archivo El Quilmero</a>
          <a href="/#footer">Contacto</a>
        </nav>
        <div className="header-actions">
          <a className="login-btn" href="/studio">Iniciar sesión</a>
          <button className="menu-btn" aria-label="Abrir menú">☰</button>
        </div>
      </div>
    </header>
  )
}
