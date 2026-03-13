import { createServer as createNodeServer } from "node:http";
import { createRoutes } from "./routes";

export function createServer() {
  const routes = createRoutes();

  return createNodeServer(async (request, response) => {
    const route = routes.find(
      (entry) =>
        entry.method === request.method && entry.path === (request.url ?? "/"),
    );

    if (!route) {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "not-found" }));
      return;
    }

    const payload = await route.handler();
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(payload, null, 2));
  });
}
