const express=require("express")
const cors=require("cors")
require("dotenv").config()
const app=express()
const cookieParser=require("cookie-parser")
const { authRouter } = require("./routes/auth.route")
const { taskRouter } = require("./routes/task.routes")


app.use(cors({
    origin:[process.env.FE_URL,"http://localhost:5173","http://localhost:5174"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/tasks", taskRouter)

module.exports=app