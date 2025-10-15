import { Request, Response } from "express";
import { SignupType } from "../validation/authValidation";
import { config } from "../validation/envValidation";
import { signupService } from "../services/signupService";

export const Signup = async (req: Request, res: Response) => {
    try {
        if (req.headers['action_secret'] !== config.ACTION_SECRET_ENV) {
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const { email, password, role } = SignupType.parse(req.body.input);

        const user = await signupService(email, password, role);

        

        return res.status(200).json({
            message: "user registered succesfully",
            user
        })

    } catch (err) {
        console.error(err)
        const message = err instanceof Error ? err.message : "Server error"
        return res.status(400).json({
            message
        })
    }
}