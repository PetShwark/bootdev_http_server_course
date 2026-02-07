import { Response, Request, NextFunction } from "express";
import { getBearerToken } from "../lib/auth/auth.js";
import { selectRefreshToken, revokeRefreshToken } from "../lib/db/queries/refresh_tokens.js";
import { NotAuthorizedError } from "../middleware/mw_error_defs.js";

export async function handlerRevokeRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const bearerToken = getBearerToken(req); // This is a refresh token, not a JWT
        const storedToken = await selectRefreshToken(bearerToken);
        if (typeof storedToken !== "object" || !("id" in storedToken)) {
            throw new NotAuthorizedError("Invalid refresh token.");
        }
        await revokeRefreshToken(storedToken.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

