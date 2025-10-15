import { AppError } from "../appError";
import prisma from "../prisma";
import { config } from "../validation/envValidation";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email: email }
    })
    if (!user) throw new AppError("user not found", 400);

    const hashedPass = user.password;
    const userID = user.id

    const result = await bcrypt.compare(password, hashedPass)

    if(!result) throw new AppError("Incorrect email or password", 400)

    const jwtSecret = config.JWTSECRET;

    const token = jwt.sign({
        email: email,
        "https://hasura.io/jwt/claims": {
            "X-Hasura-User-Id": String(userID),
            "X-Hasura-Default-Role": "customer",
            "X-Hasura-Allowed-Roles": ["customer"]
        }
    }, jwtSecret)

    return token;
}