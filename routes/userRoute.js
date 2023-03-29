const { registerUser, editUser, deleteUser, getAllUsers, getSingleUser, DestroyUsers, getUserProfile } = require("../controllers/userController")
const { adminProtected, Protected } = require("../middlewares/auth")

const router = require("express").Router()

router
.get("/", getAllUsers)
.post("/register", registerUser)
.put("/profile-update", Protected, editUser)
.delete("/delete/:id",deleteUser)
.delete("/destroy",DestroyUsers)
.get("/profile", Protected, getUserProfile)
.get("/:id",getSingleUser)

module.exports = router