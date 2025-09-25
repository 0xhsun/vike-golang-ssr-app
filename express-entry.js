import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { apiProxyHandler } from "./server/api-proxy-handler.js";
import { vikeHandler } from "./server/vike-handler.js";
import { createHandler } from "@universal-middleware/express";
import express from "express";
import { createDevMiddleware } from "vike";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678;

export default (await startServer());

async function startServer() {
  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${root}/dist/client`));
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const viteDevMiddleware = (
      await createDevMiddleware({
        root,
        viteConfig: {
          server: { hmr: { port: hmrPort } },
        },
      })
    ).devMiddleware;
    app.use(viteDevMiddleware);
  }

  // Legacy route compatibility (optional - can remove later)
  app.post("/api/todo/create", (req, res, next) => {
    req.url = "/api/todos"; // Redirect to correct Go route
    next();
  });

  // Universal BFF API proxy - forwards ALL /api/* requests to Go backend
  app.all(/^\/api\/.*/, createHandler(apiProxyHandler)());

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all("{*vike}", createHandler(vikeHandler)());

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  return app;
}
