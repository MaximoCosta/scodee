export const SITE_URL = "https://scodedigital.com";
export const SITE_NAME = "sCode";
export const EMAIL = "contact@scodedigital.com";
export const SCHEMA_EMAIL = "scodedigitalsolutions@gmail.com";
export const PHONE_DISPLAY = "+54 9 223 690 8197";
export const PHONE_E164 = "+5492236908197";
export const INSTAGRAM_URL = "https://www.instagram.com/scode.ar/";
export const WHATSAPP_URL =
  "https://wa.me/5492236908197?text=Hola%20sCode%2C%20quiero%20hacer%20una%20consulta.";
export const WHATSAPP_PLAIN = "https://wa.me/5492236908197";
export const CONTACT_API = "/api/contacto";
export const TURNSTILE_SITEKEY = "0x4AAAAAADLmXc6hyVDEHVKl";

export const LOGO_URL = `${SITE_URL}/frontEnd/images/Scodelogotipo.png`;
export const BRAND_IMAGE_URL = `${SITE_URL}/frontEnd/images/sCode.png`;
export const OG_IMAGE = {
  url: `${SITE_URL}/frontEnd/images/hero.png`,
  width: 2171,
  height: 1309,
  alt: "sCode — desarrollo web, branding y producto digital",
};

export const organizationJsonLd = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "sCode Digital Studio",
  alternateName: ["sCode Digital Studio", "sCode Digital Solutions"],
  description:
    "Estudio digital en Mar del Plata que une desarrollo web, branding y productos SaaS. Diseñamos, construimos y lanzamos con un mismo equipo.",
  url: `${SITE_URL}/`,
  slogan: "Código, marca y producto.",
  email: EMAIL,
  telephone: PHONE_E164,
  image: BRAND_IMAGE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 2000,
    height: 2000,
  },
  sameAs: [INSTAGRAM_URL, WHATSAPP_PLAIN],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: PHONE_E164,
    email: EMAIL,
    contactType: "customer service",
    availableLanguage: ["es"],
    areaServed: ["AR", "UY", "LATAM"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mar del Plata",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  areaServed: [
    { "@type": "Country", name: "Argentina" },
    { "@type": "Country", name: "Uruguay" },
    { "@type": "AdministrativeArea", name: "Latinoamérica" },
  ],
  knowsAbout: [
    "desarrollo web",
    "sistemas a medida",
    "branding",
    "SaaS",
    "landing pages",
    "identidad de marca",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de sCode",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web & Sistemas",
          description: "Sitios web, landing pages y sistemas a medida.",
          url: `${SITE_URL}/servicios/web-y-sistemas/`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SaaS",
          description: "Desarrollo de productos digitales propios o para clientes.",
          url: `${SITE_URL}/servicios/saas/`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Branding",
          description: "Identidad de marca, logo, paleta y manual de marca.",
          url: `${SITE_URL}/servicios/branding/`,
        },
      },
    ],
  },
};
