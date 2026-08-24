import {
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
} from "./constants";
import { servicesCatalog } from "./content/services.js";

const servicePages = Object.fromEntries(
  servicesCatalog.map((service) => [
    service.slug,
    {
      title: service.seo.title,
      description: service.seo.description,
      canonical: service.path,
      ogTitle: service.seo.ogTitle,
      ogDescription: service.seo.ogDescription,
      ogType: "website",
      robots: "index, follow",
    },
  ]),
);

export const pages = {
  home: {
    title: "sCode | Desarrollo web, branding y SaaS en Mar del Plata",
    description:
      "Estudio digital en Mar del Plata: desarrollo web, sistemas, branding y SaaS. Diseñamos, construimos y lanzamos sitios y productos con un mismo equipo.",
    canonical: "/",
    ogTitle: "sCode | Código, marca y producto",
    ogDescription:
      "Estudio digital que une código, marca y producto. Diseñamos, construimos y lanzamos webs, sistemas y marcas.",
    ogType: "website",
    robots: "index, follow",
  },
  contacto: {
    title: "Contacto | Desarrollo web y producto digital — sCode",
    description:
      "Hablemos de tu proyecto de desarrollo web, branding o SaaS. Estudio digital en Mar del Plata. Te contactamos para coordinar una reunión.",
    canonical: "/contacto/",
    ogTitle: "Contacto | sCode",
    ogDescription: "Hablemos de tu proyecto. Código, marca y producto en un mismo equipo.",
    ogType: "website",
    robots: "index, follow",
  },
  faq: {
    title: "Preguntas frecuentes | Desarrollo web y SaaS — sCode",
    description:
      "Tiempos de un proyecto web, diseño responsive, mantenimiento, tecnologías y rediseño. Cómo trabaja sCode: código, marca y producto en Mar del Plata.",
    canonical: "/faq/",
    ogTitle: "Preguntas frecuentes | sCode",
    ogDescription: "Cómo trabajamos, cuánto tarda un proyecto y qué incluye el estudio.",
    ogType: "website",
    robots: "index, follow",
  },
  notFound: {
    title: "Página no encontrada | sCode",
    description: "Esta página no existe. Volvé al inicio de sCode para ver servicios, proyectos y contacto.",
    canonical: null,
    ogTitle: "Página no encontrada | sCode",
    ogDescription: "Esta página no existe. Volvé al inicio de sCode.",
    ogType: "website",
    robots: "noindex, follow",
  },
  ...servicePages,
};

export function absoluteUrl(path) {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path}`;
}

export function breadcrumbJsonLd(items) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${items[items.length - 1].id}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: "sCode Digital Studio",
        description: pages.home.description,
        inLanguage: "es-AR",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: pages.home.title,
        description: pages.home.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: OG_IMAGE.url,
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
        },
        inLanguage: "es-AR",
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: "/", id: `${SITE_URL}/` },
      ]),
    ],
  };
}

export function getContactoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}/contacto/#webpage`,
        url: `${SITE_URL}/contacto/`,
        name: pages.contacto.title,
        description: pages.contacto.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "es-AR",
        mainEntity: { "@id": `${SITE_URL}/#organization` },
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: "/", id: `${SITE_URL}/` },
        { name: "Contacto", path: "/contacto/", id: `${SITE_URL}/contacto/` },
      ]),
    ],
  };
}

export function getFaqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/faq/#webpage`,
        url: `${SITE_URL}/faq/`,
        name: pages.faq.title,
        description: pages.faq.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "es-AR",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: "/", id: `${SITE_URL}/` },
        { name: "Preguntas frecuentes", path: "/faq/", id: `${SITE_URL}/faq/` },
      ]),
    ],
  };
}

export function getServiceJsonLd(service) {
  const url = absoluteUrl(service.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.seo.description,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: ["Argentina", "Uruguay", "Latinoamérica"],
        serviceType: service.title,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: service.seo.title,
        description: service.seo.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${url}#service` },
        inLanguage: "es-AR",
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: "/", id: `${SITE_URL}/` },
        { name: "Servicios", path: "/#servicios", id: `${SITE_URL}/#servicios` },
        { name: service.title, path: service.path, id: url },
      ]),
    ],
  };
}

export function jsonLdForPage(pageKey, faqs) {
  if (pageKey === "home") return getHomeJsonLd();
  if (pageKey === "contacto") return getContactoJsonLd();
  if (pageKey === "faq") return getFaqJsonLd(faqs || []);
  const service = servicesCatalog.find((item) => item.slug === pageKey);
  if (service) return getServiceJsonLd(service);
  return null;
}
