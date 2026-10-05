import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({
  logger: true
});

await server.register(cors, {
  origin: true
});

server.get("/api/health", async () => {
  return {
    status: "ok",
    game: "Wyrdane Narrative"
  };
});

const start = async () => {
  try {
    await server.listen({
      port: 3000,
      host: "0.0.0.0"
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();