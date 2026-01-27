import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerReadiness } from "./handlers/get_healthz.js";
import { middlewareLogResponses } from "./middleware/mw_logger.js";
import { middlewareMetricsInc } from "./middleware/mw_server_hits.js";
import { handlerMetrics } from "./handlers/get_metrics.js";
import { handlerMetricsReset } from "./handlers/post_reset_metrics.js";
import { handlerError } from "./middleware/mw_error_handler.js";
import { handlerUsers, handleLogin } from "./handlers/post_users.js";
import { handlerChirps } from "./handlers/post_chirps.js";
import { handlerGetChirp, handlerGetChirps } from "./handlers/get_chirps.js";


const app = express();
const PORT = 8080;

config.apiConfig.fileserverHits = 0;

// Make sure db is up-to-date
const migrationClient = postgres(config.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migrationConfig);

app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:chirpId", handlerGetChirp);
app.post("/admin/reset", handlerMetricsReset);
app.post("/api/chirps", handlerChirps);
app.post("/api/users", handlerUsers);
app.post("/api/login", handleLogin);

app.use(middlewareLogResponses);

app.use(handlerError);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});