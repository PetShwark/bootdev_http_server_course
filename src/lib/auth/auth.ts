import { hash, verify } from "argon2";
import { Request } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { BadRequestError, NotAuthorizedError } from "../../middleware/mw_error_defs.js";

export type payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await verify(hash, password);
}

export function makeJWT(userID: string, expiresInSeconds: number, secret: string): string {
    const payloadIat = Math.floor(Date.now() / 1000);
    const payloadExp = payloadIat + expiresInSeconds;
    const payLoad: payload = {
        iss: "chirpy",
        sub: userID,
        iat: payloadIat,
        exp: payloadExp
    }
    return jwt.sign(payLoad, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const verifyOutput = jwt.verify(tokenString, secret);
        if (typeof verifyOutput === "string") {
            return verifyOutput;
        } else if (verifyOutput.sub === undefined) {
            throw new NotAuthorizedError("JWT validation error.");
        } else {
            return verifyOutput.sub;
        }
    } catch (err) {
        throw new NotAuthorizedError("JWT validation error.");
    }
}

export function extractBearerToken(authorization: string | undefined): string {
    if (!authorization) {
        throw new BadRequestError("No Authorization header found.");
    }
    const parts = authorization.trim().split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new BadRequestError("Invalid Authorization header format.");
    }
    console.log("Bearer token extracted:", parts[1]);
    return parts[1].trim();
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    return extractBearerToken(authHeader);
}

export function makeRefreshToken(): string {
    return crypto.randomBytes(256 / 8).toString("hex");
}

export function getAPIKey(req: Request): string {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader) {
        const parts = authorizationHeader.split(" ");
        if (parts.length === 2 && parts[0] === "ApiKey") {
            return parts[1].trim();
        }
    }
    throw new NotAuthorizedError("No API key found in Authorization header.");
}