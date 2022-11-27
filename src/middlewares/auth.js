const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const protect =(req, res, next)=>{
  try{
    
    let token
    if(req.headers.authorization){
      token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.decoded = decoded

      next()
    }else{
      console.log("stop")
      res.json({
            message : "server need token"
        })
    }
  }catch(error){
    console.log(error);
    if(error && error.name ==='JsonWebTokenError'){
      next(new createError(400,'Token invalid'))
    }else if(error && error.name ==='TokenExpiredError'){
      next(new createError(400,'Token expired'))
    }else{
      next(new createError(400,'Token not active'))
    }
  }
}

const roles =(req, res, next) =>{
  const find = req.payload.role
  const { method } = req;
  if(method === "GET" && find === 'buyer'){
    return next()
  }else if(find === 'seller'){
    return next()
  }else{
    return res.json({
      message : "You don't have permission"
    })
  }

}


module.exports = {protect, roles}