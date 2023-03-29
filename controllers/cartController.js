const Cart = require('../models/Cart')
const asyncHandler = require("express-async-handler")

exports.addToCart = asyncHandler(async(req,res)=>{
    const {qty,productId}= req.body
    if(!qty || !productId){
        return res.status.json({
            message: "All Feild Required"
        })
    }
// console.log(req.body);
 const cartItems = await Cart.findOne({userId: req.body.userId})
 if(cartItems){
    console.log(cartItems);
    // console.log("inside");
    //     const result = await Cart.findByIdAndUpdate(found._id,req.body)
     const index =  cartItems.products.findIndex(p=> p.productId.toString() === req.body.productId)
     console.log(index);
     if(index >= 0){
        cartItems.products[index].qty = req.body.qty
        // console.log(cartItems._id);
    }else{
         cartItems.products.push(req.body)
    }
    const result = await Cart.findByIdAndUpdate(cartItems._id, cartItems, {new:true})
    console.log(result);
    res.json({
        message:"Cart updated Successfully",
        result
       })
 }else{
     const cartItem = {
         userId: req.body.userId,
         products: [req.body]
        }
        const result = await Cart.create(cartItem)
      console.log(result);
     res.json({
        message:"Product added to cart Successfully",
        result
       })
 }
})


exports.getCartData = asyncHandler(async(req,res)=>{
    const {userId} = req.body
 
   const result = await Cart.findOne({
    userId:userId
   }).populate("products.productId", "name price brand image category desc")
     .select( "-__v -createdAt -updatedAt -id -userId")
     .lean()

     if(!result){
        return res.json({
            message:"Cart Empty",
            result:[]
        })
     }
   const formatedCartItems = result.products.map(p=>{
    return {
        ...p.productId,
        qty:p.qty
    }
   })
//    console.log(x);
   res.json({
    message:"Fetched from  Cart Successfully",
    result : formatedCartItems
   })
})


exports.destroyCart = asyncHandler(async(req,res)=>{
    await Cart.deleteMany()
   res.json({
    message:"cart Destroy",
   })
})

exports.removeSingleCartItem = asyncHandler(async(req,res)=>{
   
       const {productId} = req.params
   const {userId} = req.body
   const result = await Cart.findOne({userId})
//    console.log(productId);
// console.log(result.products[0].productId.toString());
   console.log(result);
   const index = result.products.findIndex(item=>item.productId.toString() === productId)
   result.products.splice(index,1)
   const x =await Cart.findByIdAndUpdate(result._id, result, {new:true})
   console.log(x);
   res.json({
    message:"remove Success",
    x
   })
})

exports.emptyCart = asyncHandler(async(req,res)=>{
    const {userId} =req.body
  const result = await Cart.deleteOne({userId})
res.json({
 message:"remove Success",
 result
})
})

