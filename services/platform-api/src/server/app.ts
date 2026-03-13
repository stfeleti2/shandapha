import { createServer as createNodeServer } from "node:http";
import { toErrorResponse } from "./middleware/errors";
import { createRequestId } from "./middleware/request-id";
import type { PlatformRoute } from "./routes";
import { createRoutes } from "./routes";

export function createServer(routes: PlatformRoute[] = createRoutes()) {
  const routeTable = routes;

  return createNodeServer(async (request, response) => {
    const requestId = createRequestId();
    const url = new URL(request.url ?? "/", "http://localhost");
    const route = routeTable.find(
      (entry) => entry.method === request.method && entry.path === url.pathname,
    );

    if (!route) {
      response.writeHead(404, {
        "content-type": "application/json",
        "x-request-id": requestId,
      });
      response.end(
        JSON.stringify(
          {
            error: "not-found",
            message: `No route matches ${request.method} ${url.pathname}.`,
            requestId,
          },
          null,
          2,
        ),
      );
      return;
    }

    try {
      const payload = await route.handler({
        pathname: url.pathname,
        query: url.searchParams,
        request: new Request(url, { method: request.method }),
        requestId,
      });
      response.writeHead(200, {
        "content-type": "application/json",
        "x-request-id": requestId,
      });
      response.end(JSON.stringify(payload, null, 2));
    } catch (error) {
      const failure = toErrorResponse(error, requestId);
      response.writeHead(failure.status, {
        "content-type": "application/json",
        "x-request-id": requestId,
      });
      response.end(JSON.stringify(failure.body, null, 2));
    }
  });
}
