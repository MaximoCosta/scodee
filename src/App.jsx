import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Contacto } from "./pages/Contacto";
import { Faq } from "./pages/Faq";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Servicio } from "./pages/Servicio";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <ScrollToHash />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/contacto/" element={<Contacto />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/faq/" element={<Faq />} />
        <Route path="/servicios/:slug" element={<Servicio />} />
        <Route path="/servicios/:slug/" element={<Servicio />} />
        <Route path="/contacto.html" element={<Navigate to="/contacto/" replace />} />
        <Route path="/faq.html" element={<Navigate to="/faq/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
    </>
  );
}
