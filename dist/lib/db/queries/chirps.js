import { asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function selectChirps(ascending = true) {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(ascending ? asc(chirps.createdAt) : desc(chirps.createdAt));
    return result;
}
export async function selectChirp(chirpId) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}
export async function selectChirpsByAuthorId(authorId, ascending = true) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, authorId))
        .orderBy(ascending ? asc(chirps.createdAt) : desc(chirps.createdAt));
    return result;
}
export async function deleteChirps() {
    const [result] = await db
        .delete(chirps);
    return result;
}
export async function deleteChirp(chirpId) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result;
}
