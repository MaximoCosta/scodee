import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WHATSAPP_URL } from "../constants";
import { ThemeToggle } from "./ThemeToggle";

function SectionLink({ hash, children, onClick, ...props }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <a href={hash} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={`/${hash}`} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isFaq = pathname === "/faq" || pathname === "/faq/";
  const isContacto = pathname === "/contacto" || pathname === "/contacto/";
  const isServicios = pathname.startsWith("/servicios");

  const close = () => setOpen(false);

  return (
    <>
      <header>
        <nav aria-label="Principal">
          <div className="logo">
            <Link to="/" className="brand-logo" aria-label="sCode — Inicio" onClick={close}>
              <span className="brand-brace brand-brace-left">{"{"}</span>
              <span className="brand-wordmark">
                <span className="brand-main">sCode</span>
                <span className="brand-sub">digital studio</span>
              </span>
              <span className="brand-brace brand-brace-right">{"}"}</span>
            </Link>
          </div>

          <div className="nav-center">
            <SectionLink hash="#nosotros">Nosotros</SectionLink>
            <SectionLink hash="#servicios" aria-current={isServicios ? "page" : undefined}>
              Servicios
            </SectionLink>
            <SectionLink hash="#planes">Planes</SectionLink>
            <SectionLink hash="#proyectos">Proyectos</SectionLink>
            {isFaq ? (
              <a href="#faq" aria-current="page">FAQ</a>
            ) : (
              <Link to="/faq/">FAQ</Link>
            )}
            {isContacto ? (
              <a href="#contenido" aria-current="page">Contacto</a>
            ) : (
              <Link to="/contacto/">Contacto</Link>
            )}
          </div>

          <div className="nav-right">
            <ThemeToggle />
            <a
              href={WHATSAPP_URL}
              className="cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>

          <button
            className={`menu-toggle${open ? " active" : ""}`}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      <div
        className={`nav-overlay${open ? " active" : ""}`}
        id="nav-overlay"
        onClick={close}
      ></div>
      <div className={`mobile-menu${open ? " active" : ""}`} id="mobile-menu" role="navigation" aria-label="Menú móvil">
        <SectionLink hash="#nosotros" onClick={close}>
          Nosotros
        </SectionLink>
        <SectionLink hash="#servicios" onClick={close} aria-current={isServicios ? "page" : undefined}>
          Servicios
        </SectionLink>
        <SectionLink hash="#planes" onClick={close}>
          Planes
        </SectionLink>
        <SectionLink hash="#proyectos" onClick={close}>
          Proyectos
        </SectionLink>
        {isFaq ? (
          <a href="#faq" onClick={close} aria-current="page">
            FAQ
          </a>
        ) : (
          <Link to="/faq/" onClick={close}>
            FAQ
          </Link>
        )}
        {isContacto ? (
          <a href="#contenido" onClick={close} aria-current="page">
            Contacto
          </a>
        ) : (
          <Link to="/contacto/" onClick={close}>
            Contacto
          </Link>
        )}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={close}>
          WhatsApp
        </a>
      </div>
    </>
  );
}
