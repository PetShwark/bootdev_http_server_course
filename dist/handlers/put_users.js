import { validateJWT, getBearerToken } from "../lib/auth/auth.js";
import { config } from "../config.js";
import { updateUserEmail, updateUserPassword } from "../lib/db/queries/users.js";
import { hash } from "argon2";
export async function handlerUpdateUser(req, res, next) {
    try {
        const bearerToken = getBearerToken(req);
        const userId = validateJWT(bearerToken, config.apiConfig.jwtSecret);
        const newEmail = req.body.email;
        const newPassword = req.body.password;
        if (newEmail === undefined || newPassword === undefined) {
            res.status(400).send("An email and password must be provided.");
        }
        await updateUserEmail(userId, newEmail); // if above assures these are not undefined, so we can assert with !
        const hashedPassword = await hash(newPassword);
        const updatedUser = await updateUserPassword(userId, hashedPassword);
        const responseUser = {
            id: updatedUser.id,
            createdAt: updatedUser.createdAt,
            email: updatedUser.email,
            updatedAt: updatedUser.updatedAt,
            isChirpyRed: updatedUser.isChirpyRed
        };
        res.status(200).send(JSON.stringify(responseUser));
    }
    catch (err) {
        next(err);
    }
}
