const asyncHandler = require("express-async-handler")
const User = require("./../models/user")
const Employee = require("./../models/Employee")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Cart = require("../models/Cart")
const {OAuth2Client} = require("google-auth-library")
const { sendEmail } = require("../utils/email")
exports.loginUser =asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        return res.status(401).json({
            message:"All Fields required"
        })
    }
    const result = await User.findOne({email}).lean()//.select("-password -__v -createdAt -updatedAt")
    if(!result){
        return res.status(401).json({
            message:"Email is not registered with us"
        })
    }

    const verify = await bcrypt.compare(password,result.password)
    if(!verify){
        return res.status(401).json({
            message:"email or password wrong"
        })
    }
    if (!result.active){
        return res.status(401).json({
            message:"Account blocked by admin"
        })
    }
    //  const token = jwt.sign({id:result._id},process.env.JWT_KEY,{expiresIn:"15m"})
    //  const token = jwt.sign({id:result._id},process.env.JWT_KEY)
     const token = jwt.sign({id:result._id},process.env.JWT_KEY,{expiresIn:'1d'})

     const cart = await Cart.find({userId:result._id})
    
     res.json({
        message:"Login Success",
        result:{
          name:result.name,
          email:result.email,
           cart,
            token
        }
     })
})


exports.loginEmployee = asyncHandler ( async(req, res) => {
    const {email, Password} = req.body
    console.log(req.body);
    console.log(email);
    console.log(Password);

    if(!email || ! Password ){
      return res.status(400).json({
     message: "All Fleids Required"
      })
    }
 
    const result = await Employee.findOne({ email }).lean()
    if(!result) {
     return res.status(401).json({
         message: "Email is not registered with us"
          })
    }
 
  if(!result.active){
   return res.status(401).json({
       message:"Account is Blocked. Get in touch with admin"
   })
 }
    const token = jwt.sign({id: result._id}, process.env.JWT_KEY)
    //     res.cookie("token", token,{
    //     // maxAge:1000,
    //     httpOnly:true
    //     // secure:true
    // })
    res.json({
   message: "Login Success",
     result:{
     ...result,
        token
     }}
    )
 })




exports.ContinueWithGoogle =asyncHandler(async(req,res)=>{
    const {tokenId} = req.body

    if(!tokenId){
        return res.status(400).json({
            message:"please provide google Token-Id"
        })
    }
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const {payload:{name,email,picture}}= await googleClient.verifyIdToken({
    idToken :tokenId
})
   
    const result = await User.findOne({email}).lean()//.select("-password -__v -createdAt -updatedAt")
    if(!result){
        return res.status(401).json({
            message:"Email is not registered with us"
        })
    }

   if(result){
    if (!result.active){
        return res.status(401).json({
            message:"Account blocked by admin"
        })
    }

    const token = jwt.sign({id:result._id},process.env.JWT_KEY,{expiresIn:'1d'})
    const cart = await Cart.find({userId:result._id})
    res.json({
       message:"Login Success",
       result:{
          ...result,
          cart,
           token
       }
    })
   }else{
    const password = await bcrypt.hash(Date.now().toString(),10)
    const user = {
        name,
        email,
        password
    }
    const result = await User.create(user)
    const token = jwt.sign({id:result._id},process.env.JWT_KEY,{expiresIn:'1d'})

    res.json({
        message:"User Register Success",
        result:{
           ...result,
           cart:[],
            token,
        }
     })
   }

   
})


exports.Forgetpassword =asyncHandler(async(req,res)=>{
    // console.log(req.body);
    
    const result = await User.findOne({email:req.body.email}).lean()//.select("-password -__v -createdAt -updatedAt")
    if(!result){
        return res.status(401).json({
            message:"Email is not registered with us"
        })
    }
    // console.log(email)
   if(result){
    sendEmail({
        sendTo:req.body.email,
        sub:"Instruction for Forget Password with SKILLHUB",
        msg:`http://localhost:5173/reset/${result._id}`
    })
   }
   res.json({
    success:true,  
    message:"email send"
})
   
})

exports.Resetpassword =asyncHandler(async(req,res)=>{
    // console.log(req.body);
    // const {password,userId} = req.params
    const {password,id} = req.params
console.log(password,id);
    const reset = await User.findById(id).lean()//.select("-password -__v -createdAt -updatedAt")
    if(!reset){
        return res.status(401).json({
            message:"invalid link"
        })
    }
    const Bpassword = await bcrypt.hash(Date.now().toString(),10)


    const result = await User.findByIdAndUpdate(id,
        {
            password:Bpassword
        })
   
   if(!result){
    return res.status(401).json({
        success:false,
        message:"Something went wrong"
    })
}
res.json({
success:true,
message:"password reset successfully"
})
   
})
