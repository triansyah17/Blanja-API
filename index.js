require('dotenv').config()
const express = require('express')
const createError = require('http-errors')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const Router = require('./src/routes/index');


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
  origin: "*"
}))
app.use(helmet())
app.use(morgan('dev'))

app.use('/api/v1', Router )
app.use('/img', express.static('./src/upload'))


app.all('*', (req, res, next) => {
  next(new createError.NotFound())
})
app.use((err,req,res,next)=>{
  const messageError = err.message || "internal server error"
  const statusCode = err.status || 500
  
  res.status(statusCode).json({
    message : messageError
  })
  
})


const PORT = process.env.PORT || 5000
const DB_HOST = process.env.DB_HOS || 'localhost'
app.listen(PORT, () => {
  console.log(`server running on http://${DB_HOST}:${PORT}`)
})
