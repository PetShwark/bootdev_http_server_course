import { hash, verify } from "argon2";
export async function hashPassword(password) {
    return await hash(password);
}
export async function checkPasswordHash(password, hash) {
    return await verify(hash, password);
}
