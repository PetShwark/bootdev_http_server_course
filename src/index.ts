import express from "express";
import { config } from "./config.js";
import { handlerReadiness } from "./handlers/get_healthz.js";
import { middlewareLogResponses } from "./middleware/mw_logger.js";
import { middlewareMetricsInc } from "./middleware/mw_server_hits.js";
import { handlerMetrics } from "./handlers/get_metrics.js";
import { handlerMetricsReset } from "./handlers/post_reset_metrics.js";
import { handlerValidateChirp } from "./handlers/post_validate_chirp.js";

const app = express();
const PORT = 8080;

config.fileserverHits = 0;

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);
app.post("/api/validate_chirp", handlerValidateChirp);

app.use(middlewareLogResponses);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});