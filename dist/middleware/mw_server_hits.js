import { config } from "../config.js";
export function middlewareMetricsInc(req, res, next) {
    res.on('finish', () => {
        config.apiConfig.fileserverHits++;
    });
    next();
}
