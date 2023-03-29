const express = require("express")
const cors = require("cors")
require("dotenv").config({path:"./.env"})
const {log, logEvent} =require("./middlewares/logger")
const mongoose = require("mongoose")
const connectDB = require("./confiq/db")
const { errorHandler } = require("./middlewares/error")
const {format}=require("date-fns")
const path = require("path")

const app =express()
const cookieParser = require("cookie-parser")
const { adminProtected } = require("./middlewares/auth")
app.use(express.static("dist"))
app.use(express.static("public"))
// app.use(express.static(path.join(__dirname,"build")))
// app.use(express.static(path.join(__dirname,"public")))
connectDB()
app.use(log)
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    // credentials:true,
    origin:(o,cb)=>{
        const allowed=[
            "http://localhost:3000",
            "http://localhost:5173",
            "https://railway-host-production.up.railway.app/"
            
        ]
        if(allowed.indexOf(o) !== -1 || !o){
            cb(null,true)
        }else{
            cb("block by cors")
        }
    }
}))
app.use("/api/user", require("./routes/userRoute"))
app.use("/api/cart", require("./routes/cartRoutes"))
app.use("/api/order", require("./routes/orderRoute"))
app.use("/api/employe", adminProtected, require("./routes/EmployeRoute"))
app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/products", require("./routes/productRouter"))

app.use("*", (req,res)=>{
    res.status(400).json({
        message:"404:Resource you are looking for is not available"
    })
})
app.use(errorHandler)
const PORT = process.env.PORT || 5000
mongoose.connection.once("open",()=>{
    app.listen(PORT, console.log(`SERVER RUNNING http://localhost:${PORT}`))
    console.log("MONGO CONNECTED")
})

mongoose.connection.on("error",err=>{
    const msg =`${format(new Date(), "dd:MM:yyyy\t  HH:mm:ss")}\t${err.code}\t${err.name}`
    logEvent({
        filename:"mongo.log",
        message:msg
    })
})