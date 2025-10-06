import express from "express"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"


const app = express()
dotenv.config()
const port = process.env.PORT

app.use(express.json())

app.listen(port, ()=>{
    console.log(`Server Started running at port ${port}`)
})

app.post('/signup', (req, res)=>{
    try{
        if(!req.body.email || !req.body.password){
            throw new Error("Empty Request Parameters")
        }
        
        const password = req.body.password;
        const saltRound = Number(process.env.SALTROUND);

        if(!saltRound) throw new Error("Cant' find salt round")

        bcrypt.hash(password, saltRound, (err, hash)=>{
            if(err){
                return res.status(500).json({
                    message: "cant hash the password"
                })
            }
                
            return res.status(200).json({
                message: "register success",
                password:hash
            })
        })
    
    }catch(err){
        const message = err instanceof Error ? err.message : "Server error"
        return res.status(500).json({
            message
        })
    }
})

app.post('/login', (req, res)=>{
    try{
        if(!req.body.email || !req.body.password){
            throw new Error("Request parameters can't be empty")
        }
        const password = req.body.password;
        const hashedPass = ""

        bcrypt.compare(password, hashedPass,  (err, result)=>{
            if(err){
                console.log(hashedPass)
                return res.status(401).json({
                    message: "Wrong email or password"
                })
            }

            if(!process.env.JWTSECRET || typeof(process.env.JWTSECRET) !== "string"){
                return res.status(500).json({
                    message: "can't read jwt secret"
                })
            }
            const jwtSecret = process.env.JWTSECRET;

            const token = jwt.sign({email: req.body.email}, jwtSecret)

            return res.status(200).json({
                message: "Authorized",
                accessToken: token
            })
        })

    }catch(err){
        const message = err instanceof Error? err.message : "Server error"
        res.status(500).json({
            message
        })
    }
})