import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { seoHtml } from "./vite.seo-plugin.js";

function contactoApi() {
  const middleware = async (req, res, next) => {
    const path = req.url?.split("?")[0];
    if (path !== "/api/contacto") return next();

    try {
      const { default: handler } = await import("./api/contacto.js");
      await handler(req, res);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "No se pudo enviar. Probá de nuevo." }));
      }
    }
  };

  return {
    name: "contacto-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react(), seoHtml(), contactoApi()],
  };
});
