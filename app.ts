dotenv.config()
import express from "express"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { PrismaClient } from "./generated/prisma"
const prisma = new PrismaClient()


const app = express()
const port = process.env.PORT

app.use(express.json())

app.listen(port, () => {
    console.log(`Server Started running at port ${port}`)
})

app.post('/signup', async (req, res) => {
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
})

app.post('/login', async (req, res) => {
    try {
        if(req.headers['action_secret'] !== process.env.ACTION_SECRET_ENV){
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const {email,password} = req.body.input;
        if (!email || !password) {
            throw new Error("Request parameters can't be empty")
        }
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

        if (!process.env.JWTSECRET || typeof (process.env.JWTSECRET) !== "string") {
            return res.status(500).json({
                message: "can't read jwt secret"
            })
        }
        const jwtSecret = process.env.JWTSECRET;

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
})