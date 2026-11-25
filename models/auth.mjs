import { z } from "zod";

export const registerSchema = z.object({
    username: z
    .string({error: 'Username is required'})
    .trim()
    .min(3, {error: 'Username must be at least 3 characters long'})
    .max(20, {error: 'Username must be at most 20 characters long'})
    .regex(/^[a-zA-Z0-9_]+$/, {error: 'Username can only contain letters, numbers, and _'}),

    password: z
    .string({error: 'Password is required'})
    .trim()
    .min(8, {error: 'Password must be at least 8 characters long'})
    .max(100, {error: 'Password must be at most 100 characters long'})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
});
