const { addToCart, getCartData, destroyCart, removeSingleCartItem, emptyCart } = require("../controllers/cartController")
const { Protected } = require("../middlewares/auth")

const router = require("express").Router()

router


.post("/add-to-cart", Protected,addToCart)
.get("/cart-history", Protected,getCartData)
.delete("/cart-remove-single/:productId", Protected,removeSingleCartItem)
.delete("/cart-destroy",destroyCart)
.delete("/empty-cart", Protected,emptyCart)



module.exports = router