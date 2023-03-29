const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
email_verify:{
    type:Boolean,
},
password:{
    type:String,
    required:true
},
address:{
    type:String,
},
mobileVerify:{
    type:Boolean,
},
role:{
    type:String,
    enum:["intern","account","cms","support","admin"],
    default:"intern"
},
active:{
    type:Boolean,
    default:true
},
joiningDate:{
    type:String,
},
Dob:{
    type:Date,
},
gender:{
    type:String,
    enum:["male","female","other"]
},
salary:{
    type:String,
},


},{timestamp:true})

module.exports =mongoose.model("employee",employeeSchema)