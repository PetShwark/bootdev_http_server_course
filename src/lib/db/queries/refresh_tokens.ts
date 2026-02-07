import { lt, eq, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { refresh_tokens, NewRefreshToken } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
    const [result] = await db
        .insert(refresh_tokens)
        .values(token)
        .returning();
    return result;
}

export async function deleteRefreshToken(tokenId: string) {
    const [result] = await db
        .delete(refresh_tokens)
        .where(eq(refresh_tokens.id, tokenId))
        .returning();
    return result;
}

export async function deleteRefreshTokenByUserId(userId: string) {
    const result = await db
        .delete(refresh_tokens)
        .where(eq(refresh_tokens.userId, userId));
    return result;
}

export async function selectRefreshToken(tokenId: string) {
    const [result] = await db
        .select()
        .from(refresh_tokens)
        .where(eq(refresh_tokens.id, tokenId));
    return result;
}

export async function revokeRefreshToken(tokenId: string) {
    const [result] = await db
        .update(refresh_tokens)
        .set({ revokedAt: new Date() })
        .where(eq(refresh_tokens.id, tokenId))
        .returning();
    return result;
}

export async function deleteExpiredRefreshTokens() {
    const result = await db
        .delete(refresh_tokens)
        .where(lt(refresh_tokens.expiresAt, new Date()));
    return result;
}

export async function deleteRevokedRefreshTokens() {
    const result = await db
        .delete(refresh_tokens)
        .where(isNull(refresh_tokens.revokedAt));
    return result;
}