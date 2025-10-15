import bcrypt from 'bcrypt'
import prisma from '../prisma';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../validation/envValidation';
import { LoginType } from '../validation/authValidation';

export const login = async(req:Request, res:Response)=>{
    try {
        if(req.headers['action_secret'] !== config.ACTION_SECRET_ENV){
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const {email,password} = LoginType.parse(req.body.input);

        const user = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        const hashedPass = user.password;
        const userID = user.id

        const result = await bcrypt.compare(password, hashedPass)
        if (!result) {
            return res.status(400).json({
                message: "incorrect email or password"
            })
        }

        const jwtSecret = config.JWTSECRET;

        const token = jwt.sign({
            email: email,
            "https://hasura.io/jwt/claims":{
                "X-Hasura-User-Id": String(userID),
                "X-Hasura-Default-Role":"customer",
                "X-Hasura-Allowed-Roles": ["customer"]
            }
        }, jwtSecret)

        return res.status(200).json({
            message: "Authorized",
            accessToken: token
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : "Server error"
        res.status(500).json({
            message
        })
    }
}