const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const user = require("../models/user")
const Employee = require("./../models/Employee")

exports.adminProtected = expressAsyncHandler (async(req,res,next)=>{
    const token = req.headers.authorization
    // const token =  req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Please Provide Token"
        })
    }
    const {id }= jwt.verify(token,process.env.JWT_KEY)
    const result = await Employee.findById(id)
    if(!result){
        return res.status(401).json({
            message:"Cannot find this user"
        })
    }
    if(result.role !== "admin"){
        return res.status(401).json({
            message:"Admin only route , please get in touch with admin"
        })
    }
    req.body.employeeId = id
    next()
})

exports.Protected =  expressAsyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization
    console.log('xxx', req.cookies);
    if(!token){
        return res.status(401).json({
            message:"Please Provide Token"
        })
    }
    // const [, tk] = token.split("")
    const tk = token.split(" ")[1]
    const {id }= jwt.verify(tk,process.env.JWT_KEY)
      if(!id){
        return res.status(401).json({
            message:"INVALID TOKEN"
        })
    }
    const result = await user.findById(id)
    if(!result.active){
        return res.status(401).json({
            message:"Account is blocked by admin. Get in touch with admin"
        })
    }
    req.body.userId =id
    next()
      })
