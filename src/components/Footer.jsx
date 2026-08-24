import { Link } from "react-router-dom";
import {
  EMAIL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  WHATSAPP_PLAIN,
} from "../constants";

export function Footer() {
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>{"{ sCode }"}</h2>
          <p>Estudio digital. Código, marca y producto en un mismo equipo.</p>
          <div className="footer-socials">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de sCode"
            >
              <img src="/frontEnd/images/instagram.png" alt="" width="20" height="20" />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Navegación</h3>
            <Link to="/#home">Inicio</Link>
            <Link to="/#servicios">Servicios</Link>
            <Link to="/#planes">Planes</Link>
            <Link to="/#proyectos">Proyectos</Link>
            <Link to="/#proceso">Proceso</Link>
            <Link to="/faq/">FAQ</Link>
            <Link to="/contacto/">Contacto</Link>
          </div>
          <div className="footer-column">
            <h3>Stack</h3>
            <Link to="/servicios/web-y-sistemas/">Web &amp; Sistemas</Link>
            <Link to="/servicios/saas/">SaaS</Link>
            <Link to="/servicios/branding/">Branding</Link>
          </div>
          <div className="footer-column">
            <h3>Contacto</h3>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={WHATSAPP_PLAIN} target="_blank" rel="noopener noreferrer">
              {PHONE_DISPLAY}
            </a>
            <span>Mar del Plata, Argentina</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 sCode. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
