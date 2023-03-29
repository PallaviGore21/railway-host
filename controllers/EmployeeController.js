const Employee = require("./../models/Employee")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/email")
const User = require("./../models/user")
const Order = require("../models/orders")
const Product = require("./../models/product")




exports.registereEmployee = asyncHandler(async(req,res)=>{
    const {name,password,email} = req.body
    if(!name|| !password|| !email){
        return res.status(400).json({
            message:"All Fields Required"
        })
    }
    const duplicate = await Employee.findOne({email})
    if(duplicate){
        return res.status(400).json({
            message:"email already exists"
        })
    }
    const hashPass = bcrypt.hashSync(password,10)
    const result = await Employee.create({
        ...req.body,
        password:hashPass,
        role:"intern"
    })

    
    sendEmail({
        sendTo:email,
        sub:"Welcome to mern SKILLHUB TEAM",
        msg:"Hello and welcome to our website! We're thrilled to have you here. Please feel free to explore and discover all that we have to offer. If you have any questions or need assistance, don't hesitate to reach out. Thank you for registring with us!"
    })

    res.json({
        message:"Employee created successfully",
        
    })
})


exports.getAllEmployees = asyncHandler(async(req,res)=>{
     const result = await Employee.find()
     res.json({
        message:"Employee Fetched Success",
        result:{
            count:result.length,
            data:result
        }
     })
})


exports.getSingleEmployee = asyncHandler(async(req,res)=>{
    const {emplyeeId} = req.params
    const result = await Employee.findById(emplyeeId)
    if(!result){
        return res.status(401).json({
            message:"Invalid User Id"
        })
    }
    res.json({
       message:"Employee Fetched Success",
       result
    })
    // console.log(req.cookies);
    // res.json({
    //    message:"All Employee delete Success",
       
    // })
})


exports.updateEmployee = asyncHandler(async(req,res)=>{
    const {emplyeeId} = req.params
    const result = await Employee.findById(emplyeeId)
    if(!result){
        return res.status(401).json({
            message:"Invalid User Id"
        })
    }
    const {password,email} =req.body
    if(password){
        return res.status(400).json({
            message:"can not change password"
        })
    }
    if(email){
        const duplicate = await Employee.findOne({email})
        if(duplicate){
            return res.status(400).json({
                message:"duplicate email"
            })
        }
    }

    await Employee.findByIdAndUpdate(emplyeeId,req.body)

    res.json({
       message:"Employee Fetched Success",
       result
    })
})


exports.DeleteEmployee = asyncHandler(async(req,res)=>{
    const {emplyeeId} = req.params
    const result = await Employee.findOne({_id:emplyeeId})

   if(!result){
    return res.status(400).json({
        message:"Invalid Id"
    })
   }
    await Employee.findByIdAndDelete(emplyeeId)

    res.json({
       message:"Employee deleted Success",
       result
    })
})


exports.destroyEmployees = asyncHandler(async(req,res)=>{

    await Employee.deleteMany()

    res.json({
       message:"All Employee deleted Success",
       
    })
})

// exports.employeProfile = asyncHandler(async(req,res)=>{
//    console.log(req.cookies);
//     res.json({
//        message:"All Employee delete Success",
       
//     })
// })

exports.admingetAllUsers = asyncHandler(async(req,res)=>{
    try {
        const result = await User.find()
        res.json({
           message:"admin users Fetched Success",
           result
        })
    } catch (error) {
        
    }
   
})

exports.adminUserStatus = asyncHandler(async(req,res)=>{
    try {
        const {userId}= req.params
        const result = await User.findByIdAndUpdate(userId,{
            active:req.body.active
        })
        res.json({
           message:`User ${req.body.active ? "Un blocked" : "Blocked"}`
        
        })
    } catch (error) {
        
    }
   
})

exports.adminStat= asyncHandler(async(req,res)=>{

    try {
        const {userId}= req.params
        const result = await User.findByIdAndUpdate(userId,{
            active:req.body.active
        })
        const users = await User.countDocuments()
        const activeUsers = await User.countDocuments({active:true})
        const inActiveUsers = await User.countDocuments({active:false})
        const products = await Product.countDocuments()
        const publicProducts = await Product.countDocuments({publish:true})
        const unPublicProducts = await Product.countDocuments({publish:false})
        const orders =await Order.countDocuments()
        const deliveredOrders =await Order.countDocuments({orderStatus:"delivered"})
        const paidOrders =await Order.countDocuments({paymentStatus:"paid"})
        const cODOrders =await Order.countDocuments({paymentMode:"cod"})
        const onlineOrders =await Order.countDocuments({paymentMode:"online"})
        const cancledOrders = await Order.countDocuments({orderStatus:"canceled"})
        res.json({
           message: "Admin Stat Fetched Successfully",
           result:{
            users,
            activeUsers,
            inActiveUsers,
            products,
            publicProducts,
            unPublicProducts,
            orders,
            deliveredOrders,
            paidOrders,
            cODOrders,
            onlineOrders,
            cancledOrders
           }
        
        })
    } catch (error) {
        
    }
   
})