import { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerMetricsReset(req: Request, res: Response): Promise<void> {
    config.apiConfig.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("Metics reset.");
}