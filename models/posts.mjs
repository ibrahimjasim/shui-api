import { z } from 'zod';


// .strict() rejects extra fields, so nobody can sneak in "username" or "isGuest"
export const postSchema = z 
 .object({
    title:z
    .string({error: 'Title is required'})
    .trim()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title can be at most 100 characters'),
    content: z
    .string({error: 'Content is required'})
    .trim()
    .min(1, 'Content cannot be empty')
    .max(1000, 'Content can be at most 1000 characters'),

 })
.strict();

// Get posts?username -> only username
export const postsQuerySchema = z
 .object({
    username: z.string().trim().min(1, 'username cannot be empty').optional(),

 })
 .strict();