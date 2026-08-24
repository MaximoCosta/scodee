import { useState } from "react";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { faqs } from "../faqs";
import { getFaqJsonLd, pages } from "../seo";

export function Faq() {
  const [openItems, setOpenItems] = useState({});

  return (
    <>
      <Seo {...pages.faq} jsonLd={getFaqJsonLd(faqs)} />

      <main id="contenido">
        <section id="faq">
          <div className="faq-header">
            <span>FAQ</span>
            <h1>Preguntas frecuentes</h1>
            <p>
              Respondemos las dudas más comunes sobre desarrollo web, branding, SaaS, procesos y
              tiempos de trabajo en sCode.
            </p>
          </div>

          <div className="faq-container">
            {faqs.map((item, index) => {
              const isOpen = Boolean(openItems[index]);
              return (
                <article className={`faq-item${isOpen ? " active" : ""}`} key={item.question}>
                  <h2>
                    <button
                      className="faq-question"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenItems((current) => ({
                          ...current,
                          [index]: !current[index],
                        }))
                      }
                    >
                      {item.question}
                      <span>+</span>
                    </button>
                  </h2>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
