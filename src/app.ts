import express from "express"
import authRoute from "./routes/authRoutes.js"

const app = express()
const port = process.env.PORT

app.use(express.json())

app.listen(port, () => {
    console.log(`Server Started running at port ${port}`)
})

app.use('/auth', authRoute);

export default app;