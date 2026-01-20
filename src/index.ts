import express from "express";
import { config } from "./config.js";
import { handlerReadiness } from "./handlers/get_healthz.js";
import { middlewareLogResponses } from "./middleware/mw_logger.js";
import { middlewareMetricsInc } from "./middleware/mw_server_hits.js";
import { handlerMetrics } from "./handlers/get_metrics.js";
import { handlerMetricsReset } from "./handlers/get_reset_metrics.js";

const app = express();
const PORT = 8080;

config.fileserverHits = 0;

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handlerMetrics);
app.get("/api/reset", handlerMetricsReset);

app.use(middlewareLogResponses);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});