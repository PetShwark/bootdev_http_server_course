import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, getBearerToken } from "./auth.js";
describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1;
    let hash2;
    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });
    it("should return true for the correct password1", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });
    it("should return true for the correct password2", async () => {
        const result = await checkPasswordHash(password2, hash2);
        expect(result).toBe(true);
    });
});
describe("MakeJWT Testing", () => {
    const secret1 = "correctPassword123!";
    const userId1 = "test@example.com";
    const secret2 = "anotherPassword456!";
    const userId2 = "test2@example.com";
    let jwt1;
    let jwt2;
    beforeAll(async () => {
        jwt1 = makeJWT(userId1, 60, secret1);
        jwt2 = makeJWT(userId2, 60, secret2);
    });
    it("should return userId1 for the correct secret1", async () => {
        const result = validateJWT(jwt1, secret1);
        expect(result).eq(userId1);
    });
    it("should return userId2 for the correct secret2", async () => {
        const result = validateJWT(jwt2, secret2);
        expect(result).eq(userId2);
    });
    it("should throw an error for incorrect secret", async () => {
        expect(() => validateJWT(jwt1, "wrongSecret")).toThrow();
    });
    it("should throw an error for expired token", async () => {
        const shortLivedJWT = makeJWT(userId1, 1, secret1);
        // Wait for 2 seconds to ensure the token expires
        await new Promise((resolve) => setTimeout(resolve, 2000));
        expect(() => validateJWT(shortLivedJWT, secret1)).toThrow();
    });
    it("should throw an error for a request with bad bearer token", async () => {
        const mockRequest = {
            headers: {
                "Authorization": ""
            }
        };
        expect(() => getBearerToken(mockRequest)).toThrow();
    });
});
