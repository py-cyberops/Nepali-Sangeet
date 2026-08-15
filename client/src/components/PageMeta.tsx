/** Himalayan Letterpress: route-aware, domain-consistent metadata without adding a heavyweight head-management dependency. */
import { useEffect } from "react";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

type PageMetaProps = { title: string; description: string; path: string };

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function PageMeta({ title, description, path }: PageMetaProps) {
  useEffect(() => {
    const url = absoluteUrl(path);
    document.title = title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    const scriptId = "sangeet-page-schema";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      isPartOf: { "@id": `${siteConfig.origin}#website` },
      inLanguage: ["en", "ne"],
    });
  }, [description, path, title]);

  return null;
}
