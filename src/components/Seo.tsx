"use client";

import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  jsonLd?: object | object[];
  ogType?: string;
}

const upsertMeta = (name: string, content: string, attr = "name") => {
  let el = document.querySelector(`meta[${attr}='${name}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export default function Seo({
  title,
  description,
  url,
  image,
  keywords,
  jsonLd,
  ogType = "website",
}: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    upsertMeta("description", description);
    if (keywords?.length) upsertMeta("keywords", keywords.join(", "));

    // Open Graph
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", ogType, "property");
    upsertMeta("og:site_name", "Truyện Nhà Mèo", "property");
    if (url) upsertMeta("og:url", url, "property");
    if (image) upsertMeta("og:image", image, "property");

    // Twitter
    upsertMeta("twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    if (image) upsertMeta("twitter:image", image);

    // canonical
    let link: HTMLLinkElement | null = document.querySelector(
      "link[rel='canonical']"
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    if (url) link.href = url;

    // JSON-LD — support multiple schemas
    const existingScripts = document.querySelectorAll(
      "script[type='application/ld+json'][data-seo]"
    );
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.title = prevTitle;
      const scripts = document.querySelectorAll(
        "script[type='application/ld+json'][data-seo]"
      );
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, url, image, keywords, jsonLd, ogType]);

  return null;
}
