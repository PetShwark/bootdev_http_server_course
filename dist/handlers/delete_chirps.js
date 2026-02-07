import { getBearerToken, validateJWT } from "../lib/auth/auth.js";
import { config } from "../config.js";
import { selectChirp, deleteChirp } from "../lib/db/queries/chirps.js";
export async function handlerDeleteChirp(req, res, next) {
    try {
        const bearerToken = getBearerToken(req);
        const userId = validateJWT(bearerToken, config.apiConfig.jwtSecret);
        const chirpId = req.params.chirpId;
        if (chirpId === undefined) {
            res.status(400).send("Chirp ID must be provided.");
            return;
        }
        const chirpToDelete = await selectChirp(chirpId);
        if (typeof chirpToDelete !== "object" || !("id" in chirpToDelete)) {
            res.status(404).send("Chirp not found.");
            return;
        }
        if (chirpToDelete.userId !== userId) {
            res.status(403).send("Forbidden.");
            return;
        }
        await deleteChirp(chirpId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
