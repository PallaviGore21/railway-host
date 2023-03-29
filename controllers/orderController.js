const Order = require("../models/orders")
const Product=  require("../models/product")
const asyncHandler = require("express-async-handler")
const Cart = require("../models/Cart")
const User = require("./../models/user")
const { sendEmail } = require("../utils/email")
const Razorpay = require("razorpay")
const {v4 :uuid} = require("uuid")
const crypto = require("crypto")
const { orderRecipt } = require("../utils/emailTemplates")
exports.placeOrder = asyncHandler(async(req,res)=>{
   const {userId,type}= req.body
   console.log(req.body);
   if(!type){
      return res.status(400).json({
         message:"please provide type"
      })
   }
    let productArray
    if(type==='buynow'){
     
         productArray=[
            {
               productId:req.body.productId,
               qty:req.body.qty
            }
         ]
    }else{
      const cartItems = await Cart.findOne({userId})
      await Cart.deleteOne({userId})
      productArray = cartItems.products
console.log(cartItems);

}
      const result = await Order.create({
         userId,
         products:productArray,
         paymentMode:"cod"
      })   
     res.json({
        message:"Order placed Successfully",
        result
     })
})

exports.getUserOrders = asyncHandler(async(req,res)=>{
    // const {orderId} = req.params
   const result = await Order
   .find({userId: req.body.userId})
   .populate({
    path:"products",
    populate:[{
        path:"productId",
        model:"product"
    }]
   })
   .select("-userId -createdAt -updatedAt -__v")
   
   console.log(result);+
   res.json({
    message:"Order fetched Successfully",
    result:result.length,
    result
   })
})

exports.userCancleOrder = asyncHandler(async(req,res)=>{
    const {orderId} = req.params
   const result = await Order.findByIdAndUpdate(orderId,{orderStatus:"cancle"})

   res.json({
    message:"Order cancled Successfully",
    result
   })
})

exports.orderPayment = asyncHandler(async (req,res)=>{
   const instanse = new Razorpay({
      key_id :process.env.RAZORPAY_KEY,
      key_secret : process.env.RAZORPAY_SECRET
   })
   instanse.orders.create({
      amount : req.body.amount *100,
      currency:"INR",
      receipt: uuid()
   },(err, order)=>{
      if(err){
         return res.status(400).json({
            message: err
         })
      }else{
         res.json({
            message:"Payment Initiated",
            order
         })
      }
   })
})


exports.verifyPayment = asyncHandler(async (req,res)=>{
  const {razorpay_order_id ,razorpay_payment_id ,razorpay_signature} =req.body
  const key = `${razorpay_order_id}|${razorpay_payment_id}`

  const expectedSignature = crypto.createHmac("sha256", `${process.env.RAZORPAY_SECRET}`)
  .update(key.toString())
  .digest('hex')
  if(expectedSignature !== razorpay_signature){
   return res.status(400).json({
      message:"Invalid payment signature mismatch"
   })
  }
  const {userId,type}= req.body
  console.log(userId);
  const user = await User.findOne({_id:userId})
  let cartItems, result,productDetails,formatedCartItems,total
  if(type==="cart"){
      cartItems = await Cart.findOne({userId})
  
  

   productDetails = await Cart.findOne({
     userId:userId
    }).populate("products.productId", "name price brand image category desc")
      .select( "-__v -createdAt -updatedAt -id -userId")
      .lean()

      formatedCartItems = productDetails.products.map(p=>{
        return {
            ...p.productId,
            qty:p.qty
        }
       })
       console.log(formatedCartItems);
 total = formatedCartItems.reduce((sum,i)=>sum + (i.price *i.qty),0)
  
await Cart.deleteOne({userId})

  }
  else if(type==="buynow"){
   cartItems={
   products:   [{
         productId:req.body.productId,
         qty:req.body.qty
      }]
   }
   const p = await Product.findOne({_id:req.body.productId})
   total = p.price*req.body.qty
   formatedCartItems=[{
      name:p.name,
      price:p.price,
      qty:req.body.qty
   }]
  
  }

  result = await Order.create({
   userId,
   products:cartItems.products,
   paymentMode:"cod",
   paymentId: razorpay_payment_id ,
   orderId:razorpay_order_id,
   paymentSignature:razorpay_signature,
   paymentStatus:"paid"
})
   
sendEmail({
   sendTo:user.email,
   sub:"Your order has been placed",
   htmlMsg:orderRecipt({
      userName:user.name,
      date:Date.now(),
      orderId:result._id,
      products:formatedCartItems,
      total

   })
})
  res.json({
   message:"payment success"

  })
})


exports.Paymentstatus = async(req,res)=>{
   try {
       const result = await Order.create({
         payment:"fail"
       })
       res.json({
           message:"User payment fail zal",
           
       })
   } catch (error) {
       res.status(400).json({
           success:true,
           message:"payment success"
       }) 
   }
}


exports.destroyOrders = async(req,res)=>{
  
   try {
      await Order.deleteMany()
     
      res.json({
          success:true,
          message:"All Orders deleted Successfully",
          
      })
  } catch (error) {
      res.status(400).json({
          success:true,
          message:"destroy all"
      }) 
  }
}
