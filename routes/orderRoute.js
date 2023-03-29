const { placeOrder, getUserOrders, userCancleOrder, orderPayment, verifyPayment, Paymentstatus, destroyOrders} = require("../controllers/orderController")
const { Protected } = require("../middlewares/auth")

const router = require("express").Router()

router
.get("/order-history",Protected, getUserOrders)
.put("/order-cancle/:orderId",Protected, userCancleOrder)
.post("/order-place",Protected, placeOrder)
.post("/payment", orderPayment)
.post("/payment/verify",Protected, verifyPayment)
.post("/payment/fail",Protected, Paymentstatus)
.delete("/destroy",destroyOrders)
module.exports = router