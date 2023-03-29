const Product = require("./../models/product")
const asyncHandler = require("express-async-handler")
const { productUpload } = require("../utils/upload")
const jwt = require("jsonwebtoken")
const path = require('path')
const fs = require('fs').promises
exports.addProduct = asyncHandler(async(req,res)=>{
  
    productUpload(req,res,async err=>{
        const {id} = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        req.body.employeeId = id
        const {name,brand, category,desc,price,stock,employeeId} = req.body
        console.log(req.body);
        if(!name || !brand  || !category || !desc, !price || !stock || ! employeeId){
            return res.status(400).json({
                message:"All fields required"
            })
        }
        if(err){
            return res.status(400).json({
                message:"multer Error" + err
            })
        }
        const fileNames =[]

        for(let i=0; i<req.files.length; i++){
            // assets/images/products
            fileNames.push(`assets/images/products/${req.files[i].filename}`)
        }
        const result = await Product.create({
            ...req.body,
            image:fileNames
        })
        res.json({
            message:"producta added successfully",
            result:{...result}
        })
    })
})                                                                                     

exports.getProduct = asyncHandler(async(req,res)=>{
    const result = await Product.find().select("-employeeId -createdAt -updatedAt -__v")
    if(!result){
        return res.status(400).json({
            message:"Invalid Product Id"
        })
    }
    res.json({
       message:"products Fetched Success",
       result:{
           data:result,
           count:result.length,
       }
    })

})

exports.getSingleProduct = asyncHandler(async(req,res)=>{
    const {productId} =req.params
    console.log(productId);
    const result = await Product.findById(productId).select("-employeeId -createdAt -updatedAt -__v")
    if(!result){
        return res.status(400).json({
            message:"Invalid Product Id"
        })
    }
    res.json({
       message:`Single product with id ${productId} Fetched Success`,
       result
    })

})

exports.updateProduct = asyncHandler(async(req,res)=>{
    const {productId} =req.params
    console.log(productId);
    const singleProduct = await Product.findById(productId)
    if(!singleProduct){
        return res.status(400).json({
            message:"Invalid Product Id"
        })
    }

    productUpload(req, res, async err => {
        if (err) {
            return res.status(400).json({
                message: "Multer Error " + err
            })
        }
        let fileNames = []

        for (let i = 0; i < req.files.length; i++) {
            fileNames.push(`assets/images/products/${req.files[i].filename}`)
        }
        // console.log(req.files);
        // console.log(req.body);

        if (fileNames.length > 0) {
            for (let i = 0; i < singleProduct.image.length; i++) {
                await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
            }
        } else {
             fileNames = singleProduct.image
        }

            
        const result = await Product.findByIdAndUpdate(productId, {
            ...req.body,
            image: fileNames
        }, { new: true })

        res.json({ 
            message: "product update success" ,
            result
        })


    })


})  

exports.deleteProduct = asyncHandler(async(req,res)=>{
    const {id} =req.params
    // console.log(req.body);
    const result = await Product.findByIdAndDelete(id)
    if(!result){
        return res.status(400).json({
            message:"Invalid Product Id"
        })
    }
    res.json({
       message:"products deleted Success",
     
    })

})

exports.destroyProduct = asyncHandler(async(req,res)=>{
    const result = await Product.deleteMany()
    // await fs.unlink
    res.json({
       message:"all products destroy Success",
       
    })

})


exports.getAllProduct = asyncHandler(async(req,res)=>{
    const result = await Product.find().select(" -createdAt -updatedAt -__v")
    if(!result){
        return res.status(400).json({
            message:"Invalid Product Id"
        })
    }
    res.json({
       message:"products Fetched Success",
       result:{
           data:result,
           count:result.length,
       }
    })

})


exports.updateProductImages = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const singleProduct = await Product.findById(productId)
    if (!singleProduct) {
        return res.status(400).json({
            message: "Invalid Product Id"
        })
    }

    productUpload(req, res, async err => {
        if (err) {
            return res.status(400).json({
                message: "Multer Error " + err
            })
        }
        for (let i = 0; i < singleProduct.image.length; i++) {
            await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
        }
        let fileNames = []
            for (let i = 0; i < req.files.length; i++) {
                fileNames.push(`assets/images/products/${req.files[i].filename}`)
            }

       
        const result = await Product.findByIdAndUpdate(productId, {
            image: fileNames
        }, { new: true })

        res.json({ 
            message: "ok" ,
            result
        

        })


    })


})