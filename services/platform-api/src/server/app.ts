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
      const bodyText = await new Promise<string>((resolve, reject) => {
        let payload = "";

        request.setEncoding("utf8");
        request.on("data", (chunk) => {
          payload += chunk;
        });
        request.on("end", () => resolve(payload));
        request.on("error", reject);
      });
      const body =
        bodyText.length === 0
          ? undefined
          : request.headers["content-type"]?.includes("application/json")
            ? JSON.parse(bodyText)
            : bodyText;
      const payload = await route.handler({
        body,
        pathname: url.pathname,
        query: url.searchParams,
        request: new Request(url, {
          method: request.method,
          body: bodyText.length > 0 ? bodyText : undefined,
          headers: request.headers as HeadersInit,
        }),
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
