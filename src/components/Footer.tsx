import Image from 'next/image'

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/isotipo.png"
              alt="Isotipo Asociación Los Quilmeros"
              width={720}
              height={376}
              style={{height: 46, width: 'auto'}}
            />
            <div>
              <div className="serif" style={{color: 'var(--marfil)', fontSize: 18}}>Asociación Los Quilmeros</div>
              <p>Investigación, historia y patrimonio del partido de Quilmes.</p>
            </div>
          </div>
          <div>
            <h5>Explorar</h5>
            <ul>
              <li><a href="/institucion">Institución</a></li>
              <li><a href="/#publicaciones">Publicaciones</a></li>
              <li><a href="/#efemerides">Efemérides</a></li>
              <li><a href="/#archivo">Archivo El Quilmero</a></li>
            </ul>
          </div>
          <div>
            <h5>Contacto</h5>
            <ul>
              <li>Página de Facebook</li>
              <li>Correo de la asociación</li>
              <li>Quilmes, Buenos Aires</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Asociación de Historiadores &quot;Los Quilmeros&quot;</span>
          <span>Sitio en construcción</span>
        </div>
      </div>
    </footer>
  )
}
