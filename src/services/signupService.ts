import { config } from "../validation/envValidation";
import bcrypt from 'bcrypt';
import prisma from "../prisma";
import { Role } from "../validation/authValidation";

export const signupService = async(email:string, password:string, role:Role)=>{
    const saltRound = Number(config.SALTROUND);

    const hash = await bcrypt.hash(password, saltRound);

    const user = await prisma.user.create({
        data: {
            email: email,
            password: hash,
            role: role
        }
    })
    return user;
}