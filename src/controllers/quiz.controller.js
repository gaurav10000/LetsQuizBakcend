import { asyncHandler } from "../utils/asyncHandler.js";
import { Quiz } from '../models/quiz.model.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";



const createQuiz = asyncHandler(async(req, res) => {
    const { quizCode, quizTitle, subject, availableAfter, availableTill, totalTimeLimit } = req.body
    const id = req.user._id // this is the id of the user who is creating the quiz
    console.log(id);

    if (!(quizCode && quizTitle && availableAfter && availableTill && totalTimeLimit)) {
        throw new ApiError(400, "All fields are required")
    }

    if (!req.user) {
        throw new ApiError(401, "Unauthorized request!")
    }

    const createdQuiz = await Quiz.create({
        quizCode,
        quizTitle,
        subject,
        availableAfter,
        availableTill,
        totalTimeLimit,
        createdBy: id
    }).catch((err) => {
        if (err.code == 11000) {
            throw new ApiError(409, "Quiz with same quizCode already exists!n")
        }
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

const getActiveQuizzes = asyncHandler(async(req, res) =>{
    const activeQuizzes = await Quiz.find({availableAfter: {$lte: new Date()}, availableTill: {$gte: new Date()}})
    
    return res.status(200)
              .json(new ApiResponse(
                200,
                activeQuizzes,
                "Active quizzes fetched successfully!"
              ))
})

const getQuizzesICreated = asyncHandler(async(req, res) => {
    const id = req.user._id;

    if (!id) {
        throw new ApiError(401, "Unauthorized request!")
    }

    const quizzesCreated = await Quiz.find({createdBy: id});

    if (!quizzesCreated) {
        throw new ApiError(404, "No quizzes created by you!")
    }

    return res.status(200).json(new ApiResponse(200, quizzesCreated, "Quizzes fetched successfully!"))
})

const deleteQuiz = asyncHandler(async(req, res) => {
    const quizCode = req.params.quizCode
    const userId = req.user._id

    const deletedQuiz = await Quiz.findOneAndDelete({
        $and: [{quizCode}, {createdBy: userId}]
    })

    if (!deleteQuiz) {
        throw new ApiError(404, "No quiz found!")
    }

    res.status(200).json(new ApiResponse(200, deletedQuiz, "Quiz Deleted Successfully!"))
})


export {
    createQuiz,
    addQuestionToQuiz,
    getActiveQuizzes,
    getQuizzesICreated,
    deleteQuiz
}