import { asc, eq } from "drizzle-orm";
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
export async function selectChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return result;
}
export async function selectChirp(chirpId) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}
export async function deleteChirps() {
    const [result] = await db
        .delete(chirps);
    return result;
}
