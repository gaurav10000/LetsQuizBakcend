import { asyncHandler } from "../utils/asyncHandler.js";
import { Quiz } from '../models/quiz.model.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";



const createQuiz = asyncHandler(async(req, res) => {
    const { quizCode, title, availableAfter, availableTill, totalTimeLimit } = req.body
    
    if (!(quizCode || title || availableAfter || availableTill || totalTimeLimit)) {
        throw new ApiError(400, "All fields are required")
    }

    if (!req.user) {
        throw new ApiError(401, "Unauthorized request!")
    }
    const user = req.user

    const createdQuiz = await Quiz.create({
        quizCode: quizCode,
        title: title,
        availableAfter: availableAfter,
        availableTill: availableTill,
        totalTimeLimit: totalTimeLimit,
        createdBy: user._id
    })

    return res.status(201)
              .json(new ApiResponse(
                201,
                createdQuiz,
                "Quiz created successfully!"
              ))
})

const addQuestionToQuiz = asyncHandler(async(req, res) => {
    try {
        const {quizCode, isMultiCorrect, question, options} = req.body
        // console.log("again");
        if (!(quizCode || isMultiCorrect || question || options)) {
            throw new ApiError(400, "All fields are required!")
        }
    
        const quiz = await Quiz.findOne({quizCode})
    
        if (!quiz) {
            throw new ApiError(404, "There is no quiz in database with the quiz code you provided!")
        }
    
        const previousQuestions = quiz.questions

        previousQuestions.push({
            _id: previousQuestions.length + 1,
            isMultiCorrect: isMultiCorrect,
            question: question,
            options: options
        })
    
        quiz.questions = previousQuestions
        quiz.save() 
        res.status(200).json({
            message: "success"
        })
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while adding questions")
    }
})


export {
    createQuiz,
    addQuestionToQuiz
}