import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function selectUserByEmail(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result;
}
export async function selectUserById(id) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
    return result;
}
export async function updateUserEmail(id, newEmail) {
    const [result] = await db
        .update(users)
        .set({ email: newEmail })
        .where(eq(users.id, id))
        .returning();
    return result;
}
export async function updateUserPassword(id, newHashedPassword) {
    const [result] = await db
        .update(users)
        .set({ hashedPassword: newHashedPassword })
        .where(eq(users.id, id))
        .returning();
    return result;
}
export async function upgradeUser(id) {
    const [result] = await db
        .update(users)
        .set({ isChirpyRed: true })
        .where(eq(users.id, id))
        .returning();
    return result;
}
export async function deleteUsers() {
    const [result] = await db
        .delete(users);
    return result;
}
