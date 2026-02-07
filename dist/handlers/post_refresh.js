import { config } from "../config.js";
import { getBearerToken } from "../lib/auth/auth.js";
import { selectRefreshToken } from "../lib/db/queries/refresh_tokens.js";
import { NotAuthorizedError } from "../middleware/mw_error_defs.js";
import { makeJWT } from "../lib/auth/auth.js";
export async function handlerRefreshJwt(req, res, next) {
    try {
        const bearerToken = getBearerToken(req); // This is a refresh token, not a JWT
        const storedToken = await selectRefreshToken(bearerToken);
        if (typeof storedToken !== "object" || !("id" in storedToken)) {
            throw new NotAuthorizedError("Invalid refresh token.");
        }
        if (storedToken.expiresAt < new Date()) {
            throw new NotAuthorizedError("Refresh token expired.");
        }
        if (storedToken.revokedAt !== null) {
            throw new NotAuthorizedError("Refresh token revoked.");
        }
        const userId = storedToken.userId;
        const newJwt = makeJWT(userId, 60 * 60, config.apiConfig.jwtSecret); // One hour expiry
        res.status(200).send(JSON.stringify({
            token: newJwt
        }));
    }
    catch (err) {
        next(err);
    }
}
