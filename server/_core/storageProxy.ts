import type { Express } from "express";
import { ENV } from "./env";

/**
 * These immutable listening-room assets now ship with client/public so Pages
 * can serve them directly. Let Vite/Express static serving handle the same
 * stable URLs when the full app runs locally or on a traditional Node host.
 */
const STATIC_LISTENING_ROOM_ASSETS = new Set([
  "sangeet-ghar-logo_eb966bc7.webp",
  "sangeet-ghar-vintage-radio-room_451ded6e.webp",
  "sangeet-ghar-social-card_dbc58915.jpg",
  "sangeet-ghar-tuning-click_f70ab9cc.mp3",
  "NithyaRanjanaDU-Regular_c2811c64.otf",
]);

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res, next) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (STATIC_LISTENING_ROOM_ASSETS.has(key)) {
      next();
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
