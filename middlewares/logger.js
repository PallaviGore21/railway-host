const fs = require("fs")
const {format} = require("date-fns")
const prepend = require("prepend-file")

const logEvent =async({
    filename,
    message
})=>{
    try{
        if(!fs.existsSync("./logs")){
          fs.mkdirSync("./logs")
        }
       await prepend(`./logs/${filename}`, message)

    }catch(error){
       console.log(error)
    }
}




const log =(req,res,next)=>{
    const msg = `${format(new Date(),"dd-MM-yyyy \t HH:mm:ss")}\t${req.method}\t${req.url}\t${req.headers.origin}\n`
    logEvent({
        filename:"req.log",
        message:msg
    })
   next()
}
module.exports={
    log,
    logEvent
}