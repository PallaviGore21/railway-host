const { addProduct, getProduct, getSingleProduct, updateProduct, deleteProduct, destroyProduct, updateProductImages, getAllProduct } = require("../controllers/productController")
const { adminProtected } = require("../middlewares/auth")

const router = require("express").Router()

router
.get("/", getProduct)
.get("/admin-getallproduct", adminProtected, getAllProduct)
.post("/addproduct", adminProtected, addProduct)
.get("/detail/:productId", getSingleProduct)
.put("/update/:productId",adminProtected, updateProduct)
.put("/update-product-image/:productId", adminProtected, updateProductImages)
.delete("/delete/:id",adminProtected, deleteProduct)
.delete("/destroy",adminProtected, destroyProduct)


module.exports = router