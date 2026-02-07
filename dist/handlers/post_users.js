import { hash, verify } from "argon2";
import { createUser, selectUserByEmail } from "../lib/db/queries/users.js";
import { createRefreshToken } from "../lib/db/queries/refresh_tokens.js";
import { NotAuthorizedError } from "../middleware/mw_error_defs.js";
import { makeJWT, makeRefreshToken } from "../lib/auth/auth.js";
import { config } from "../config.js";
export async function handlerUsers(req, res, next) {
    try {
        const emailAddress = req.body.email;
        const password = req.body.password;
        const hashedPassword = await hash(password);
        const userToCreate = {
            email: emailAddress,
            hashedPassword: hashedPassword
        };
        const newUser = await createUser(userToCreate);
        const responseUser = {
            id: newUser.id,
            createdAt: newUser.createdAt,
            email: newUser.email,
            updatedAt: newUser.updatedAt
        };
        res.status(201).send(JSON.stringify(responseUser));
    }
    catch (err) {
        next(err);
    }
}
export async function handleLogin(req, res, next) {
    try {
        const emailAddress = req.body.email;
        const password = req.body.password;
        const selectedUser = await selectUserByEmail(emailAddress);
        let authorized = true;
        if (typeof selectedUser !== "object") {
            authorized = false;
        }
        else if (!("id" in selectedUser)) {
            authorized = false;
        }
        else {
            const userHashedPassword = selectedUser.hashedPassword ?? "";
            const passwordMatch = await verify(userHashedPassword, password);
            if (!passwordMatch) {
                authorized = false;
            }
        }
        if (authorized) {
            const expiresInSeconds = 60 * 60; // One hour
            const jwt = makeJWT(selectedUser.id, expiresInSeconds, config.apiConfig.jwtSecret);
            const refreshToken = makeRefreshToken();
            await createRefreshToken({
                id: refreshToken,
                userId: selectedUser.id,
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
            });
            const responseUser = {
                id: selectedUser.id,
                createdAt: selectedUser.createdAt,
                updatedAt: selectedUser.updatedAt,
                email: selectedUser.email,
                token: jwt,
                refreshToken: refreshToken
            };
            res.status(200).send(JSON.stringify(responseUser));
        }
        else {
            throw new NotAuthorizedError("Incorrect email or password.");
        }
    }
    catch (err) {
        next(err);
    }
}
