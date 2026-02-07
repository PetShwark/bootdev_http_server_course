import { hash, verify } from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../../middleware/mw_error_defs.js";
export async function hashPassword(password) {
    return await hash(password);
}
export async function checkPasswordHash(password, hash) {
    return await verify(hash, password);
}
export function makeJWT(userID, expiresInSeconds, secret) {
    const payloadIat = Math.floor(Date.now() / 1000);
    const payloadExp = payloadIat + expiresInSeconds;
    const payLoad = {
        iss: "chirpy",
        sub: userID,
        iat: payloadIat,
        exp: payloadExp
    };
    return jwt.sign(payLoad, secret);
}
export function validateJWT(tokenString, secret) {
    try {
        const verifyOutput = jwt.verify(tokenString, secret);
        if (typeof verifyOutput === "string") {
            return verifyOutput;
        }
        else if (verifyOutput.sub === undefined) {
            throw new NotAuthorizedError("JWT validation error.");
        }
        else {
            return verifyOutput.sub;
        }
    }
    catch (err) {
        throw new NotAuthorizedError("JWT validation error.");
    }
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new NotAuthorizedError("No Authorization header found.");
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new NotAuthorizedError("Invalid Authorization header format.");
    }
    console.log("Bearer token extracted:", parts[1]);
    return parts[1];
}
export function makeRefreshToken() {
    return crypto.randomBytes(256 / 8).toString("hex");
}
