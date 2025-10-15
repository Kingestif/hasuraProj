import express from 'express';
const router = express.Router();  
import { PrismaClient } from '@prisma/client';
import { login } from '../controllers/loginController';
import { Signup } from '../controllers/signupController';

const prisma = new PrismaClient();

router.post('/login',login)

router.post('/signup', Signup)


export default router;