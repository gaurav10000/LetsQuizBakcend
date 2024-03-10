import express from 'express';
import cookieParser from 'cookie-parser';


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true})) // we use express.urlencoded to parse form data that is sent in the request body from the client side to the server side in a POST request or a PUT request. The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.

// routes import 
import userRouter from './routes/user.routes.js'


// routes 
app.use('/api/v1/users', userRouter)



export default app