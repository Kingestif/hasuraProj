import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from 'bcrypt';

export const Signup = async(req:Request, res:Response)=>{
    try {
        if(req.headers['action_secret'] !== process.env.ACTION_SECRET_ENV){
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const { email, password, role } = req.body.input
        if (!email || !password || !role) {
            throw new Error("Empty Request Parameters")
        }

        const saltRound = Number(process.env.SALTROUND);

        if (!saltRound) throw new Error("Cant' find salt round")

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