import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { ServiceStack } from "../components/ServiceStack";
import { CONTACT_API, TURNSTILE_SITEKEY } from "../constants";
import { plans } from "../content/plans";
import { getContactoJsonLd, pages } from "../seo";

const planMessages = Object.fromEntries(
  plans.map((plan) => [
    plan.slug,
    plan.quote
      ? `Quiero consultar el plan ${plan.name}.`
      : `Quiero el plan ${plan.name} (${plan.pricePrefix ? `${plan.pricePrefix} ` : ""}${plan.price}).`,
  ]),
);

export function Contacto() {
  const [searchParams] = useSearchParams();
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const planMessage = planMessages[searchParams.get("plan")] || "";

  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !widgetRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITEKEY,
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("website")) {
      setStatus("ok");
      return;
    }

    const token =
      widgetIdRef.current != null && window.turnstile
        ? window.turnstile.getResponse(widgetIdRef.current)
        : "";

    if (!token) {
      setStatus("error");
      setErrorMessage("Completá la verificación antes de enviar.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          email: data.get("email"),
          telefono: data.get("telefono"),
          horario: data.get("horario"),
          mensaje: data.get("mensaje"),
          turnstileToken: token,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No se pudo enviar.");
      }

      setStatus("ok");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "No se pudo enviar. Probá de nuevo.");
    } finally {
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }

  return (
    <>
      <Seo {...pages.contacto} jsonLd={getContactoJsonLd()} />

      <main id="contenido">
        <section className="contacto-page">
          <div className="contacto-shell">
            <div className="contacto-hero">
              <span>Contacto</span>
              <h1>Hablemos de tu proyecto</h1>
              <p>
                Contanos qué necesitás. Unimos código, marca y producto para diseñar, construir y
                lanzar con un mismo equipo en Mar del Plata.
              </p>
            </div>

            <div className="contacto-grid">
              <div className="contacto-visual" aria-hidden="true">
                <div className="contacto-visual-card">
                  <ServiceStack showBadge={false} />
                </div>
              </div>

              <form className="formulario" onSubmit={handleSubmit} noValidate={false}>
                <input type="text" name="website" autoComplete="off" tabIndex={-1} hidden />

                <div className="formulario-header">
                  <span>Presupuesto</span>
                  <h2>Contanos sobre tu idea</h2>
                  <p>
                    Mientras más contexto nos des, mejor preparamos la reunión para hablar de
                    objetivos, tiempos y próximos pasos.
                  </p>
                </div>

                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  minLength={2}
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  required
                />

                <label htmlFor="telefono">Número de teléfono</label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="Tu número de teléfono"
                  autoComplete="tel"
                  required
                />

                <label htmlFor="horario">Disponibilidad para reunirnos</label>
                <input
                  id="horario"
                  name="horario"
                  type="text"
                  placeholder="Ej: esta semana por la tarde"
                  autoComplete="off"
                />

                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Contanos sobre tu proyecto"
                  rows={5}
                  minLength={10}
                  defaultValue={planMessage}
                  required
                />

                <div ref={widgetRef} className="cf-turnstile" />

                <button type="submit" className="cta-btn" disabled={status === "sending"}>
                  {status === "sending" ? "Enviando..." : "Enviar consulta"}
                </button>

                {status === "ok" ? (
                  <p className="formulario-status is-ok" role="status">
                    Recibimos tu consulta. Te escribimos a la brevedad.
                  </p>
                ) : null}

                {status === "error" ? (
                  <p className="formulario-status is-error" role="alert">
                    {errorMessage}
                  </p>
                ) : null}
              </form>
            </div>

            <div className="contacto-info">
              <article>
                <span>01</span>
                <h2>Reunión a la brevedad</h2>
                <p>Te contactamos para coordinar una llamada y entender bien el alcance del proyecto.</p>
              </article>
              <article>
                <span>02</span>
                <h2>Código, marca y producto</h2>
                <p>Webs, sistemas, branding y SaaS. Las tres capas, un solo equipo.</p>
              </article>
              <article>
                <span>03</span>
                <h2>Mar del Plata</h2>
                <p>Trabajamos remoto con marcas, negocios y equipos de cualquier lugar.</p>
              </article>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
