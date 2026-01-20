import { config } from "../config.js";
export async function handlerMetricsReset(req, res) {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("Metics reset.");
}
