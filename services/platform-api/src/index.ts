import { createServer } from "./server/app";

const port = Number(process.env.PORT ?? 4000);
const server = createServer();

server.listen(port, () => {
  console.log(`Shandapha platform-api listening on http://localhost:${port}`);
});
