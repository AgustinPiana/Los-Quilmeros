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
              <li>
                <a href="https://www.facebook.com/groups/589317591242180/" target="_blank" rel="noopener">
                  Página de Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/ah_losquilmeros/" target="_blank" rel="noopener">
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/589317591242180/"
                  target="_blank"
                  rel="noopener"
                  title="Todavía no tenemos WhatsApp — por ahora te lleva al grupo de Facebook"
                >
                  WhatsApp
                </a>
              </li>
              <li>Correo de la asociación</li>
              <li>Quilmes, Buenos Aires</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Asociación de Historiadores &quot;Los Quilmeros&quot;</span>
          <span>
            Powered by{' '}
            <a href="https://keep-ds.com/" target="_blank" rel="noopener">
              Keep DS
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
