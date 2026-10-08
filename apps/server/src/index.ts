import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";

import scenesRoutes from "./routes/scenes.js";

const app = Fastify({
	logger: true,
});

await app.register(cors, {
	origin: true,
});

await app.register(scenesRoutes, {
	prefix: "/api",
});

app.get("/api/health", async () => {
	return {
		status: "ok",
	};
});

const port = Number(process.env.PORT ?? 3000);

const host = process.env.HOST ?? "0.0.0.0";

try {
	await app.listen({
		port,
		host,
	});

	console.log(`Wyrdane server listening on http://localhost:${port}`);
} catch (error) {
	app.log.error(error);
	process.exit(1);
}
