const {format} = require("date-fns")
const { logEvent } = require("./logger")

exports.errorHandler=(err,req,res,next)=>{
    try{

        const msg =`${format(new Date(), "dd-MM-yyyy \t HH:mm:ss")}\t${err.name}\t${req.method}\t${err.message}\t${req.url}\t${req.headers.origin}\n`
        logEvent({
            filename:"error.log",
            message:msg
        })
        console.log("------------------")
        console.log(err)
        console.log("------------------")
        res.status(400).json({
            message:"Error" + err.message
        })
    }catch(error){
        console.log(error)
    }
}