import * as z from 'zod';

export const LoginType = z.object({
    email:z.email(),
    password:z.string()
})


const role = z.enum(["customer", "admin"]);
export type Role = z.infer<typeof role>;


export const SignupType = z.object({
    email: z.email(),
    password:z.string(),
    role:role
})