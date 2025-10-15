import * as z from 'zod';

export const LoginType = z.object({
    email:z.email(),
    password:z.string()
})

export const SignupType = z.object({
    email: z.email(),
    password:z.string(),
    role:z.enum(["customer", "admin"])
})