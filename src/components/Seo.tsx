"use client";

import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  jsonLd?: object;
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
}: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    upsertMeta("description", description);
    upsertMeta("keywords", (keywords || []).join(", "));

    // Open Graph
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
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

    // JSON-LD
    let ld: HTMLScriptElement | null = null;
    if (jsonLd) {
      ld = document.querySelector("script[type='application/ld+json']");
      if (!ld) {
        ld = document.createElement("script");
        ld.type = "application/ld+json";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = prevTitle;
      // Note: we intentionally keep meta tags for caching / SSR parity; cleanup not mandatory
    };
  }, [title, description, url, image, keywords, jsonLd]);

  return null;
}
