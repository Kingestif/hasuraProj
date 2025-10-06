import express from "express"
const app = express()
const port = 5000
app.use(express.json());

app.listen(port, ()=>{
    console.log(`Server Started running at port ${port}`)
})

app.post('/login', (req, res)=>{
    try{
        console.log(req.body)
        if(!req.body){
            throw new Error("Empty Request Parameters")
        }
    
        return res.status(200).json({
            accessToken:"123"
        })
    }catch(err){
        const message = err instanceof Error ? err.message : "Server error";
        return res.status(500).json({
            message
        })
    }
})