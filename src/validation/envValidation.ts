import * as z from 'zod';
import dotenv from 'dotenv'
dotenv.config()

const envs = z.object({
    PORT: z.string(),
    JWTSECRET: z.string(),
    SALTROUND: z.string(),
    PG_DATABASE_URL: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    HASURA_GRAPHQL_ADMIN_SECRET: z.string(),
    HASURA_ACTION_BASE_URL: z.string(),
    ACTION_SECRET_ENV: z.string(),
})

const envValidate = envs.safeParse(process.env);

if (!envValidate.success) {
    console.error(envValidate.error.issues);
    process.exit(1);
}

export const config = envValidate.data;