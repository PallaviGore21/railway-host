const User = require("./../models/user")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { sendEmail } = require("../utils/email")

exports.registerUser = async(req,res)=>{
    try {
        console.log(req.body);
        const {name,email,password}=req.body
        if(!name || !email || !password){
                throw new Error ("All fields required")
            }
        
        const found = await User.findByIdAndUpdate(req.body.userId, req.body)
        if(found){
            throw new Error ("email already exists")
        }
        const hashPass =await bcrypt.hash(password,10)
        const result = await User.create({
            ...req.body,
            name,
            email,
            password:hashPass,
            
        })
        const token = jwt.sign({id:result._id},process.env.JWT_KEY)
   
        sendEmail({
            sendTo:email,
            sub:"Welcome to mern E-commerce",
            msg:"Hello and welcome to our website! We're thrilled to have you here. Please feel free to explore and discover all that we have to offer. If you have any questions or need assistance, don't hesitate to reach out. Thank you for registring with us!"
        })

        res.json({
            message:"user register successfully",
            result:{
                name,
                token,
                id:result._id
            }
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Error" + error
        })   
    }
}

exports.editUser = async(req,res)=>{
    try {
        // const {id }= req.params
        const result = await User.findByIdAndUpdate(req.body.userId,req.body)
        res.json({
            success:true,
            message:"User updated Successfully",
            
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:""+error
        }) 
    }
}

exports.deleteUser = async(req,res)=>{
    try {
        const {id }= req.params
        const result = await User.findByIdAndDelete(id)
        res.json({
            message:"User deleted Successfully",
            
        })
    } catch (error) {
        res.status(400).json({
            success:true,
            message:""
        }) 
    }
}

exports.getAllUsers = async(req,res)=>{
    try {
        const result = await User.find()
        res.json({
            message:"User fetched Successfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            success:true,
            message:""
        }) 
    }
}

exports.getSingleUser = async(req,res)=>{
    try {
        const {id }= req.params
        const result = await User.findOne({_id:id})
        if(!result){
            throw new Error("user Not Found")
        }
        res.json({
            message:"User fetched Successfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            success:true,
            message:"single user error"
        }) 
    }
}

exports.DestroyUsers = async(req,res)=>{
    try {
        await User.deleteMany()
       
        res.json({
            success:true,
            message:"All User deleted Successfully",
            
        })
    } catch (error) {
        res.status(400).json({
            success:true,
            message:"destroy all"
        }) 
    }
}

exports.getUserProfile = async(req,res)=>{
    try {
        console.log(req.body.userId);
        console.log(req.body);
        const result = await User.findOne({_id:req.body.userId}).select("-password -id -__v -createdAt -updatedAt")
        if(!result){
            throw new Error("user Not Found")
        }
        res.json({
            message:"User Profile fetched Successfully",
            result:{
                name: result.name,
                email: result.email,            
                mobile: result.mobile || "",
                house: result.house || "",            
                pincode: result.pincode || "",            
                state: result.state || "",
                landmark: result.landmark || "",
                city: result.city || "",
                      
                         }
        })
    } catch (error) {
        res.status(400).json({
            success:true,
            message:"single user error"
        }) 
    }
}


// express async handler