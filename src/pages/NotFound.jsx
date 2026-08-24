import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { pages } from "../seo";

export function NotFound() {
  return (
    <>
      <Seo {...pages.notFound} />

      <main id="contenido" className="not-found">
        <p className="eyebrow">404</p>
        <h1>No encontramos esta página</h1>
        <p>
          El enlace puede estar desactualizado o escrito distinto. Volvé al inicio para ver
          servicios, ejemplos y contacto.
        </p>
        <div className="content-actions">
          <Link to="/" className="btn-primary">
            Ir al inicio
          </Link>
          <Link to="/contacto/" className="btn-outline">
            Contacto
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
