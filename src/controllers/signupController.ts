import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from 'bcrypt';
import { SignupType } from "../validation/authValidation";
import { config } from "../validation/envValidation";

export const Signup = async (req: Request, res: Response) => {
    try {
        if (req.headers['action_secret'] !== config.ACTION_SECRET_ENV) {
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const { email, password, role } = SignupType.parse(req.body.input);

        const saltRound = Number(config.SALTROUND);

        const hash = await bcrypt.hash(password, saltRound);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hash,
                role: role
            }
        })

        return res.status(200).json({
            message: "user registered succesfully",
            user
        })

    } catch (err) {
        console.error(err)
        const message = err instanceof Error ? err.message : "Server error"
        return res.status(500).json({
            message
        })
    }
}