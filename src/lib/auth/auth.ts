import { hash, verify } from "argon2";
import { Request } from "express";
import jwt from "jsonwebtoken";

export type payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payloadIat = Math.floor(Date.now() / 1000);
    const payloadExp = payloadIat + expiresIn;
    const payLoad: payload = {
        iss: "chirpy",
        sub: userID,
        iat: payloadIat,
        exp: payloadExp
    }
    return jwt.sign(payLoad, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    const verifyOutput = jwt.verify(tokenString, secret);
    if (typeof verifyOutput === "string") {
        return verifyOutput;
    } else if (verifyOutput.sub === undefined) {
        throw new Error("JWT validation error.");
    } else {
        return verifyOutput.sub;
    }
}

export function getBearerToken(req: Request): string {
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
