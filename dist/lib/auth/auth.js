import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
export async function hashPassword(password) {
    return await hash(password);
}
export async function checkPasswordHash(password, hash) {
    return await verify(hash, password);
}
export function makeJWT(userID, expiresIn, secret) {
    const payloadIat = Math.floor(Date.now() / 1000);
    const payloadExp = payloadIat + expiresIn;
    const payLoad = {
        iss: "chirpy",
        sub: userID,
        iat: payloadIat,
        exp: payloadExp
    };
    return jwt.sign(payLoad, secret);
}
export function validateJWT(tokenString, secret) {
    const verifyOutput = jwt.verify(tokenString, secret);
    if (typeof verifyOutput === "string") {
        return verifyOutput;
    }
    else if (verifyOutput.sub === undefined) {
        throw new Error("JWT validation error.");
    }
    else {
        return verifyOutput.sub;
    }
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new Error("No Authorization header found.");
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new Error("Invalid Authorization header format.");
    }
    console.log("Bearer token extracted:", parts[1]);
    return parts[1];
}
