import { useEffect } from "react";
import { OG_IMAGE, SITE_NAME } from "../constants";
import { absoluteUrl } from "../seo";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return;
  const extras = Object.entries(extra)
    .map(([name, value]) => `[${name}="${value}"]`)
    .join("");
  let element = document.head.querySelector(`link[rel="${rel}"]${extras}`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    Object.entries(extra).forEach(([name, value]) => element.setAttribute(name, value));
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function Seo({
  title,
  description,
  canonical,
  jsonLd,
  ogTitle,
  ogDescription,
  robots = "index, follow",
  ogType = "website",
}) {
  const url = canonical ? absoluteUrl(canonical) : null;
  const socialTitle = ogTitle || title;
  const socialDescription = ogDescription || description;

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "author", SITE_NAME);
    upsertLink("canonical", url);
    if (url) {
      upsertLink("alternate", url, { hreflang: "es" });
      upsertLink("alternate", url, { hreflang: "es-AR" });
      upsertLink("alternate", url, { hreflang: "x-default" });
    }

    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "es_AR");
    upsertMeta("property", "og:title", socialTitle);
    upsertMeta("property", "og:description", socialDescription);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", OG_IMAGE.url);
    upsertMeta("property", "og:image:alt", OG_IMAGE.alt);
    upsertMeta("property", "og:image:width", String(OG_IMAGE.width));
    upsertMeta("property", "og:image:height", String(OG_IMAGE.height));
    upsertMeta("property", "og:image:type", "image/png");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", socialTitle);
    upsertMeta("name", "twitter:description", socialDescription);
    upsertMeta("name", "twitter:image", OG_IMAGE.url);
    upsertMeta("name", "twitter:image:alt", OG_IMAGE.alt);

    document.head.querySelectorAll("script[data-seo='jsonld']").forEach((node) => node.remove());

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "jsonld";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.head.querySelectorAll("script[data-seo='jsonld']").forEach((node) => node.remove());
    };
  }, [title, description, url, socialTitle, socialDescription, jsonLd, robots, ogType]);

  return null;
}
