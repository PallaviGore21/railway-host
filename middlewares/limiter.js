const { logEvent } = require("./logger")
const rateLimiter = require("express-rate-limit")
const { format } = require("date-fns")

exports.loginLimiter = rateLimiter({
    windowMs :60*1000,
    max:100,
    message:"Too many attempts",
    
    handler :(req,res,next,options)=>{
        const msg = `${format(new Date(), "dd-MM-yyyy\t HH:mm:ss")}\t${req.url}\t${req.methos}\t${req.headers.origin}\t Too many login attempts\n`
        logEvent({
            message:msg,
            filename:"error.log"
        })
      return  res.status(401).json({
            message:"too many attempts, please retry after 60 seconds"
        })
    }
})


