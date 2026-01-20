import { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerMetrics(req: Request, res: Response): Promise<void> {
    res.set("Content-Type", "text/html; charset=utf-8");
    const body = `<html>\n<body>\n<h1>Welcome, Chirpy Admin</h1>\n<p>Chirpy has been visited ${config.fileserverHits} times!</p>\n</body>\n</html>`;
    res.send(body);
}