import express from "express"
import dotenv from "dotenv"
import router from "./routes/authRoutes.js"
dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())

app.listen(port, () => {
    console.log(`Server Started running at port ${port}`)
})

app.use('/auth',router);

export default app;