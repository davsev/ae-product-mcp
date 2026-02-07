import axios from "axios";
import * as cheerio from "cheerio";

async function fetchHtml(url) {
  const res = await axios.get(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "accept-language": "en-US,en;q=0.9"
    },
    timeout: 20000
  });

  return res.data;
}

function extractProductFromJsonLd($) {
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const raw = $(scripts[i]).html();
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (item["@type"] === "Product") {
          return item;
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractEmbeddedState(html) {
  const match = html.match(/window\._d_c_\.DCData\s*=\s*(\{.*?\});/s);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function extractFromMeta($) {
  return {
    title: $('meta[property="og:title"]').attr("content") || null,
    description:
      $('meta[name="description"]').attr("content") || null,
    main_image:
      $('meta[property="og:image"]').attr("content") || null
  };
}


export async function fetchAliProduct(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // 1. JSON-LD
  const productLd = extractProductFromJsonLd($);
  if (productLd) {
    return {
      title: productLd.name || null,
      description: productLd.description || null,
      main_image: Array.isArray(productLd.image)
        ? productLd.image[0]
        : productLd.image || null,
      source: "json-ld"
    };
  }

  // 2. Embedded state
  const state = extractEmbeddedState(html);
  if (state?.imageModule) {
    return {
      title: state.titleModule?.subject || null,
      description: state.descriptionModule?.description || null,
      main_image: state.imageModule.imagePathList?.[0] || null,
      source: "embedded-state"
    };
  }

  // 3. Meta fallback
  const meta = extractFromMeta($);
  console.log(meta);
  return {
    ...meta,
    source: "meta-fallback"
  };
}
