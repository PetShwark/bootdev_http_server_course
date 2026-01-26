import { config } from "../config.js";
import { deleteUsers } from "../lib/db/queries/users.js";
import { ForbiddenError } from "../middleware/mw_error_defs.js";
import { deleteChirps } from "../lib/db/queries/chirps.js";
export async function handlerMetricsReset(req, res, next) {
    if (config.apiConfig.platform === "dev") {
        try {
            config.apiConfig.fileserverHits = 0;
            await deleteUsers();
            await deleteChirps();
            res.set("Content-Type", "text/plain; charset=utf-8");
            res.send("Metics reset.");
        }
        catch (err) {
            next(err);
        }
    }
    else {
        throw new ForbiddenError("Dev mode only");
    }
}
