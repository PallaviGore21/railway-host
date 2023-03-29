const {loginUser, loginEmployee, ContinueWithGoogle, Forgetpassword, Resetpassword} =require("../controllers/authController")
const { loginLimiter } = require("../middlewares/limiter")

const router = require("express").Router()

router
.post("/user/login",loginLimiter, loginUser)
.post("/employee/login", loginLimiter,loginEmployee)
.post("/forget", loginLimiter,Forgetpassword)
.post("/reset/:id", loginLimiter,Resetpassword)
.post("/user/login-with-google", loginLimiter, ContinueWithGoogle)

module.exports = router