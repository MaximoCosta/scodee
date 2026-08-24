import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { OG_IMAGE, SITE_NAME } from "./src/constants.js";
import { servicesCatalog } from "./src/content/services.js";
import { faqs } from "./src/faqs.js";
import { absoluteUrl, jsonLdForPage, pages } from "./src/seo.js";

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
}

function setMeta(html, attr, key, content) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`, "i");
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function setLink(html, rel, href, extra = "") {
  const hreflang = extra.match(/hreflang="([^"]+)"/)?.[1];
  const re = hreflang
    ? new RegExp(`<link rel="${rel}" href="[^"]*" hreflang="${hreflang}"\\s*/?>`, "i")
    : new RegExp(`<link rel="${rel}" href="[^"]*"\\s*/?>`, "i");
  const tag = extra
    ? `<link rel="${rel}" href="${escapeAttr(href)}" ${extra} />`
    : `<link rel="${rel}" href="${escapeAttr(href)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function setCanonical(html, href) {
  const re = /<link rel="canonical" href="[^"]*"\s*\/?>/i;
  if (!href) return html.replace(re, "");
  return setLink(html, "canonical", href);
}

function setJsonLd(html, data) {
  const re = /<script type="application\/ld\+json" data-seo="jsonld">[\s\S]*?<\/script>/i;
  if (!data) return html.replace(re, "");
  const tag = `<script type="application/ld+json" data-seo="jsonld">${JSON.stringify(data)}</script>`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function applyPageSeo(html, pageKey) {
  const page = pages[pageKey];
  const url = page.canonical ? absoluteUrl(page.canonical) : null;
  const socialTitle = page.ogTitle || page.title;
  const socialDescription = page.ogDescription || page.description;
  const jsonLd = jsonLdForPage(pageKey, faqs);

  let next = setTitle(html, page.title);
  next = setMeta(next, "name", "description", page.description);
  next = setMeta(next, "name", "robots", page.robots);
  next = setMeta(next, "name", "author", SITE_NAME);
  next = setCanonical(next, url);
  if (url) {
    next = setLink(next, "alternate", url, 'hreflang="es"');
    next = setLink(next, "alternate", url, 'hreflang="es-AR"');
    next = setLink(next, "alternate", url, 'hreflang="x-default"');
  }
  next = setMeta(next, "property", "og:type", page.ogType);
  next = setMeta(next, "property", "og:site_name", SITE_NAME);
  next = setMeta(next, "property", "og:locale", "es_AR");
  next = setMeta(next, "property", "og:title", socialTitle);
  next = setMeta(next, "property", "og:description", socialDescription);
  if (url) next = setMeta(next, "property", "og:url", url);
  next = setMeta(next, "property", "og:image", OG_IMAGE.url);
  next = setMeta(next, "property", "og:image:alt", OG_IMAGE.alt);
  next = setMeta(next, "property", "og:image:width", String(OG_IMAGE.width));
  next = setMeta(next, "property", "og:image:height", String(OG_IMAGE.height));
  next = setMeta(next, "name", "twitter:title", socialTitle);
  next = setMeta(next, "name", "twitter:description", socialDescription);
  next = setMeta(next, "name", "twitter:image", OG_IMAGE.url);
  next = setMeta(next, "name", "twitter:image:alt", OG_IMAGE.alt);
  next = setJsonLd(next, jsonLd);
  return next;
}

function writeHtml(filePath, html) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html);
}

export function seoHtml() {
  return {
    name: "seo-html",
    closeBundle() {
      const indexPath = join("dist", "index.html");
      const source = readFileSync(indexPath, "utf8");

      writeFileSync(indexPath, applyPageSeo(source, "home"));
      writeHtml(join("dist", "faq", "index.html"), applyPageSeo(source, "faq"));
      writeHtml(join("dist", "contacto", "index.html"), applyPageSeo(source, "contacto"));
      servicesCatalog.forEach((service) => {
        const dir = join("dist", ...service.path.split("/").filter(Boolean));
        writeHtml(join(dir, "index.html"), applyPageSeo(source, service.slug));
      });
      writeHtml(join("dist", "404.html"), applyPageSeo(source, "notFound"));
    },
  };
}
