const nodemailter = require("nodemailer")

exports.sendEmail =({sendTo,msg,sub,htmlMsg})=>{
    const transporter = nodemailter.
    createTransport({
        service:"gmail",
       
        auth:{
            user:"pallavigore1999@gmail.com",
            pass:"iafuvfvisrehtvmn",
           
        }
})
transporter.sendMail({
     to:sendTo,
     from:"pallavigore21@gmail.com",
     subject:sub,
     text:msg,
     html:htmlMsg
},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("EMAIL SEND SUCCESSFULLY");
    }
})
}
// iafuvfvisrehtvmn