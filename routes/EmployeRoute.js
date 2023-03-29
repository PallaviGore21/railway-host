const { registereEmployee, getAllEmployees, getSingleEmployee, updateEmployee, DeleteEmployee, destroyEmployees, admingetAllUsers, adminUserStatus, adminStat } = require("../controllers/EmployeeController")

const router = require("express").Router()

router
.get("/", getAllEmployees)
.get("/profile", getSingleEmployee)
.put("/update/:emplyeeId", updateEmployee)
.delete("/delete/:emplyeeId", DeleteEmployee)
.post("/register", registereEmployee)
.delete("/destroy", destroyEmployees)


.get("/users", admingetAllUsers)
.get("/stat", adminStat)
.put("/users/status/:userId", adminUserStatus)


module.exports = router