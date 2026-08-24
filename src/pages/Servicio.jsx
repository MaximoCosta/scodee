import { Link, useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { serviceIcons } from "../content/serviceIcons";
import { getServiceBySlug, servicesCatalog } from "../content/services";
import { getServiceJsonLd, pages } from "../seo";
import { NotFound } from "./NotFound";

export function Servicio() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return <NotFound />;
  }

  const Icon = serviceIcons[service.slug];
  const others = servicesCatalog.filter((item) => item.slug !== service.slug);
  const seo = pages[service.slug];

  return (
    <>
      <Seo {...seo} jsonLd={getServiceJsonLd(service)} />

      <main id="contenido">
        <article className="servicio-page">
          <section className="servicio-hero">
          <p className="eyebrow">{service.eyebrow}</p>
          <span className={`service-icon ${service.iconClass}`} aria-hidden="true">
            <Icon />
          </span>
          <h1>
            {service.title}
            {service.badge ? <span className="tag-nuevo"> {service.badge}</span> : null}
          </h1>
          <p className="servicio-lead">{service.headline}</p>
          <p className="servicio-dek">{service.lead}</p>
          <Link to="/contacto/" className="btn-primary">
            {service.cta}
          </Link>
        </section>

        <section className="servicio-block">
          <h2>De qué se trata</h2>
          {service.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="servicio-block">
          <h2>{service.includesTitle}</h2>
          <div className="servicio-grid">
            {service.includes.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="servicio-block">
          <h2>{service.forWhoTitle}</h2>
          <ul className="servicio-who">
            {service.forWho.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="servicio-block">
          <h2>{service.processTitle}</h2>
          <ol className="servicio-steps">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="servicio-block">
          <h2>{service.stackTitle}</h2>
          <p>{service.stack}</p>
        </section>

        <section className="servicio-block">
          <h2>Preguntas frecuentes</h2>
          <div className="servicio-faqs">
            {service.faqs.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="servicio-block">
          <h2>Las otras líneas</h2>
          <p className="servicio-others-lead">
            Código, marca y producto se piensan juntos. Si este no es el único frente, estas son las
            otras dos.
          </p>
          <div className="servicio-others">
            {others.map((item) => {
              const OtherIcon = serviceIcons[item.slug];
              return (
                <Link to={item.path} className="servicio-other-card" key={item.slug}>
                  <span className={`service-icon ${item.iconClass}`} aria-hidden="true">
                    <OtherIcon />
                  </span>
                  <strong>{item.title}</strong>
                  <span>{item.headline}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="servicio-cta">
          <h2>{service.cta}</h2>
          <p>Contanos el alcance. Coordinamos una reunión y vemos el siguiente paso.</p>
          <Link to="/contacto/" className="btn-primary">
            Ir a contacto
          </Link>
        </section>
        </article>
        <Footer />
      </main>
    </>
  );
}
