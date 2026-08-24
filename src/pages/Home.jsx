import { AppWindow, Check, Code2, Layers, MessagesSquare, Palette, Pencil, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { ServiceStack } from "../components/ServiceStack";
import { Typewriter } from "../components/Typewriter";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { WHATSAPP_URL } from "../constants";
import { plans } from "../content/plans";
import { serviceIcons } from "../content/serviceIcons";
import { servicesCatalog } from "../content/services";
import { getHomeJsonLd, pages } from "../seo";

const projects = [
  {
    href: "https://francescoramirez.github.io/landingteleinformatica/frontEnd/index.html",
    title: "Ver Landing Page de Teleinformática",
    image: "/frontEnd/images/sArqitecture.png",
    alt: "Ejemplo de landing page para marca personal",
    meta: "ejemplo · landing",
    heading: "Marca personal para consultora",
    body: "Sitio claro, secciones orientadas a conversión y formulario para captar consultas.",
  },
  {
    href: "https://landing-sk-nine.vercel.app/",
    title: "Ver Sistema Web de Skollege",
    image: "/frontEnd/images/skollege.png",
    alt: "Ejemplo de panel tipo SaaS",
    badge: "ejemplo",
    meta: "ejemplo · saas",
    heading: "Panel de gestión para servicios",
    body: "Dashboard privado para organizar clientes, pedidos y métricas desde una sola pantalla.",
  },
];

const processSteps = [
  {
    iconClass: "service-icon-code",
    Icon: MessagesSquare,
    title: "Reunión",
    body: "Hablamos para entender tu negocio, tus objetivos y lo que necesitás.",
  },
  {
    iconClass: "service-icon-brand",
    Icon: Pencil,
    title: "Diseño",
    body: "Propuesta visual y de producto, alineada con tu marca y con lo que se puede construir.",
  },
  {
    iconClass: "service-icon-code",
    Icon: Code2,
    title: "Desarrollo",
    body: "Construimos con tecnología actual, cuidando velocidad, estructura y experiencia.",
  },
  {
    iconClass: "service-icon-saas",
    Icon: Rocket,
    title: "Lanzamiento",
    body: "Publicamos, verificamos y te dejamos listo para operar y seguir iterando.",
  },
];

export function Home() {
  return (
    <>
      <Seo {...pages.home} jsonLd={getHomeJsonLd()} />

      <main id="contenido">
      <section id="home">
        <div className="hero">
          <div className="hero-frame">
            <img
              className="hero-img hero-img-light"
              src="/frontEnd/images/hero.png"
              alt="Notebook de sCode"
              width={2171}
              height={1309}
              decoding="async"
              fetchPriority="high"
            />
            <img
              className="hero-img hero-img-dark"
              src="/frontEnd/images/hero-dark.png"
              alt=""
              width={1024}
              height={617}
              decoding="async"
              aria-hidden="true"
            />
            <h1 className="hero-title">
              <Typewriter text="Modernizamos tu negocio." startDelay={1200} />
            </h1>
          </div>

          <div className="hero-content">
            <p>Creamos sitios web modernos, rápidos y adaptados a cualquier dispositivo.</p>
            <div className="hero-actions">
              <Link to="/contacto/" className="hero-reunion">
                Hacé crecer tu negocio.
              </Link>
              <a
                href={WHATSAPP_URL}
                className="hero-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="funciona">
        <div className="cont">
          <Reveal className="texto">
            <p className="eyebrow">sCode</p>
            <h2>
              Tres capas.
              <br />
              Un solo equipo.
            </h2>
            <p className="parrafo">
              No somos una agencia que solo entrega una web. Unimos código, marca y producto para
              que lo que se diseña se pueda construir — y lo que se construye se pueda lanzar.
            </p>
            <p className="negrita">Diseñamos, construimos y lanzamos.</p>
          </Reveal>

          <div className="terminal-panel" aria-label="Stack de servicios sCode">
            <div className="stack-chrome">
              <span className="stack-dot"></span>
              <span className="stack-dot"></span>
              <span className="stack-dot"></span>
              <code>$ scode --init</code>
            </div>
            <ServiceStack linked />
          </div>
        </div>
      </section>

      <section id="servicios">
        <div className="textos">
          <p className="eyebrow">Servicios</p>
          <h2>Tres líneas. Un estudio.</h2>
          <p>Web, producto y marca — juntas, no en silos.</p>
        </div>

        <div className="contenedor">
          {servicesCatalog.map((service) => {
            const Icon = serviceIcons[service.slug];
            return (
              <Reveal as="article" className="tarjetas" key={service.slug}>
                <Link to={service.path} className="tarjetas-link">
                  <span className={`service-icon ${service.iconClass}`} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>
                    {service.title}
                    {service.badge ? <span className="tag-nuevo"> {service.badge}</span> : null}
                  </h3>
                  <p>{service.seo.ogDescription}</p>
                  <ul className="servicio-lista">
                    {service.includes.slice(0, 3).map((item) => (
                      <li key={item.title}>{item.title}</li>
                    ))}
                  </ul>
                  <span className="servicio-more">Ver más</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="planes">
        <div className="textos">
          <p className="eyebrow">Planes</p>
          <h2>Tres cortes. Un mismo estudio.</h2>
          <p>Lanzamiento y Presencia con precio de partida. El Full se cotiza según el proyecto.</p>
        </div>

        <div className="planes-grid">
          {plans.map((plan) => (
            <Reveal
              as="article"
              className={`plan-card${plan.featured ? " is-featured" : ""}${plan.full ? " is-full" : ""}`}
              key={plan.slug}
            >
              <div className="plan-top">
                <p className="plan-eyebrow">
                  {plan.eyebrow}
                  {plan.badge ? <span className="tag-nuevo">{plan.badge}</span> : null}
                </p>
                <h3>{plan.name}</h3>
                <p className="plan-price">
                  {plan.pricePrefix ? <span>{plan.pricePrefix}</span> : null}
                  <strong>{plan.price}</strong>
                </p>
                <p className="plan-blurb">{plan.blurb}</p>
              </div>
              <ul className="plan-items">
                {plan.items.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={`/contacto/?plan=${plan.slug}`}
                className={plan.featured || plan.full ? "btn-primary" : "btn-outline"}
              >
                {plan.cta}
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="planes-note">
          Valores de referencia en USD. El precio final se cierra en la reunión, según contenidos,
          plazos e integraciones.
        </p>
      </section>

      <section id="proyectos">
        <div className="textos">
          <p className="eyebrow">Ejemplos</p>
          <h2>Lo que podemos crear para vos</h2>
          <p>
            Ejemplos de sitios, sistemas y productos. Aún no son casos publicados: son el tipo de
            trabajo que hacemos.
          </p>
        </div>

        <div className="proyectos-grid">
          {projects.map((project) => (
            <Reveal as="article" className="proyecto-card" key={project.heading}>
              <a href={project.href} title={project.title} target="_blank" rel="noopener noreferrer">
                {project.badge ? (
                  <span className="tag-nuevo proyecto-badge">{project.badge}</span>
                ) : null}
                <div className="proyecto-preview">
                  <img
                    src={project.image}
                    alt={project.alt}
                    width={1200}
                    height={570}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proyecto-info">
                  <span>{project.meta}</span>
                  <h3>{project.heading}</h3>
                  <p>{project.body}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="proceso">
        <div className="textos">
          <p className="eyebrow">Proceso</p>
          <h2>De la reunión al lanzamiento</h2>
          <p>Un proceso corto y transparente para diseñar, construir y lanzar.</p>
        </div>

        <div className="process-wrapper">
          <div className="contenedorProceso">
            {processSteps.map(({ iconClass, Icon, title, body }) => (
              <Reveal className="tarjetaProceso" key={title}>
                <span className={`service-icon ${iconClass}`} aria-hidden="true">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <div className="card-line"></div>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="process-banner">
            <div className="banner-left">
              <span className="service-icon service-icon-saas" aria-hidden="true">
                <Layers />
              </span>
              <div className="banner-text">
                <h3>Te acompañamos en todo el proceso</h3>
                <p>Código, marca y producto — en cada paso, no al final.</p>
              </div>
            </div>
            <Link to="/contacto/" className="banner-btn">
              Hablemos de tu proyecto
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="nosotros">
        <div className="nosotros-container">
          <Reveal className="nosotros-content" threshold={0.3}>
            <p className="eyebrow">Nosotros</p>
            <h2>Un estudio en Mar del Plata.</h2>
            <p>
              sCode ya no es solo desarrollo web. Diseñamos identidad, construimos sitios y
              sistemas, y lanzamos productos digitales — las tres cosas, con el mismo equipo.
            </p>

            <div className="nosotros-cards">
              <div className="nosotros-card">
                <span className="service-icon service-icon-code" aria-hidden="true">
                  <Code2 />
                </span>
                <h3>Código</h3>
                <p>Webs y sistemas rápidos, escalables y pensados para operar de verdad.</p>
              </div>
              <div className="nosotros-card">
                <span className="service-icon service-icon-brand" aria-hidden="true">
                  <Palette />
                </span>
                <h3>Marca</h3>
                <p>Identidad y piezas que no parecen de plantilla. Se sienten propias.</p>
              </div>
              <div className="nosotros-card">
                <span className="service-icon service-icon-saas" aria-hidden="true">
                  <AppWindow />
                </span>
                <h3>Producto</h3>
                <p>SaaS y herramientas que salen al mercado y se pueden iterar.</p>
              </div>
            </div>

            <Link to="/contacto/" className="nosotros-btn">
              Quiero empezar →
            </Link>
          </Reveal>

          <Reveal className="nosotros-image" delay={300} threshold={0.3}>
            <img
              src="/frontEnd/images/about us.png"
              alt="Equipo de sCode diseñando y construyendo producto digital"
              width={1024}
              height={1536}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>
      </section>

      <Footer />
      </main>
    </>
  );
}
