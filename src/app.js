import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true})) // we use express.urlencoded to parse form data that is sent in the request body from the client side to the server side in a POST request or a PUT request. The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
app.use(cors({
    origin: "https://dulcet-entremet-7b04a7.netlify.app",
    credentials: true,
}))


// routes import 
import userRouter from './routes/user.routes.js'
import quizRouter from './routes/quiz.routes.js'
import questionRouter from './routes/question.routes.js'
import solutionRouter from './routes/solution.routes.js'
import resultRouter from './routes/result.routes.js'

// routes 
app.use('/api/v1/users', userRouter)
app.use('/api/v1/quiz', quizRouter)
app.use('/api/v1/question', questionRouter)
app.use('/api/v1/solution', solutionRouter)
app.use('/api/v1/result', resultRouter)

// default route
app.get('/', (req, res) => {
    res.json({message: "Welcome to Quiz App"})
})

export default app