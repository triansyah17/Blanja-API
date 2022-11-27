const jwt = require('jsonwebtoken')
const generateToken = (payload) =>{
    const verifyOpts = { 
      expiresIn: '7d',
      issuer: 'tokoku' 
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts)
      return token;
}

const generateRefreshToken = (payload)=>{
  const verifyOpts = { expiresIn: '28d' }
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts)
  return token;
}
 
module.exports = {generateToken, generateRefreshToken}