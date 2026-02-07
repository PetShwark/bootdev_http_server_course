import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function selectUserByEmail(email: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result;
}

export async function selectUserById(id: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
    return result;
}

export async function updateUserEmail(id: string, newEmail: string) {
    const [result] = await db
        .update(users)
        .set({ email: newEmail })
        .where(eq(users.id, id))
        .returning();
    return result;
}

export async function updateUserPassword(id: string, newHashedPassword: string) {
    const [result] = await db
        .update(users)
        .set({ hashedPassword: newHashedPassword })
        .where(eq(users.id, id))
        .returning();
    return result;
}

export async function deleteUsers() {
    const [result] = await db
        .delete(users);
    return result;
}