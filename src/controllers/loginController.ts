import { Request, Response } from 'express';
import { config } from '../validation/envValidation';
import { LoginType } from '../validation/authValidation';
import { loginService } from '../services/loginService';

export const login = async(req:Request, res:Response)=>{
    try {
        if(req.headers['action_secret'] !== config.ACTION_SECRET_ENV){
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const {email,password} = LoginType.parse(req.body.input);

        const accessToken = await loginService(email, password);

        return res.status(200).json({
            message: "Authorized",
            accessToken: accessToken
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : "Server error"
        console.log(message);
        res.status(400).json({
            message
        })
    }
}