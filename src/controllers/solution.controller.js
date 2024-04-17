

import { Quiz } from "../models/quiz.model.js";
import { Solution } from "../models/solutions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import StudentQuizResult from "../utils/result.js";


const submitSolution = asyncHandler(async(req, res) => {
    const {quizCode, questionId, options} = req.body;
    let score = 1;
    let isCorrect = true;
    if (!quizCode || !questionId || !options) {
        throw new ApiError(400, "Please provide all the required fields")
    }

    const alreadySubmittedAnswer = await Solution.findOne({
        $and: [{userId: req.user._id}, {quizCode: quizCode}, {questionId: questionId}]
    })

    if(alreadySubmittedAnswer) {
        throw new ApiError(409, "Aready submitted an answer for this question!")
    }

    // const correctOptions = new Array()

    // options.forEach(option => {
    //     if(option.isCorrect) {
    //         correctOptions.push(option._id)
    //     }
    // });

    // if (correctOptions.length == selectedAnswers.length) {

    //     for(let i=0; i < correctOptions.length; ++i) {
    //         if (!selectedAnswers.some((ele) => ele == correctOptions[i])) {
    //             score = 0;
    //             isCorrect = false
    //             break
    //         }else {
    //             score = 1;
    //             isCorrect = true;
    //         }            
    //     }
    // }

    for(let i=0; i<options.length; ++i) {
        if(options[i].isCorrect) {
            if (!options[i].isSelected) {
                score = 0;
                isCorrect = false
                break
            }
        }else {
            if (options[i].isSelected) {
                score = 0;
                isCorrect = false
                break
            }
        }
    }


    const solution = await Solution.create({
        userId: req.user._id, // iss user ne
        quizCode, // iss quiz ke
        questionId, // iss question ke
        options, // inn options mai se
        // selectedAnswers, // ye selected answers diye hai
        score: score,
        isCorrect: isCorrect
    })

    if (!solution) {
        throw new ApiError(500, "Something went wrong while submitting the solution")
    }
    const quiz = await Quiz.findOne({quizCode})
    const result = await StudentQuizResult(quizCode, req.user._id, quiz._id, score)

    console.log(result);

    res.status(201).json(new ApiResponse(201, solution, "Answer for the question has been submitted successfully!"))
})

// I don't think it is needed anymore
const getsubmittedSolutionforAQuestion = asyncHandler(async(req, res) => {
    const {quizCode, questionId} = req.params;
    // console.log(quizCode, questionId);
    // console.log(req.user._id);
    if (!quizCode || !questionId) {
        throw new ApiError(400, "Please provide all the required fields")
    }

    const submittedAnswer = await Solution.findOne({
        $and: [{userId: req.user._id}, {quizCode: quizCode}, {questionId: questionId}]
    })

    // console.log(submittedAnswer);
    if (!submittedAnswer) {
        throw new ApiError(404, "No answer submitted for this question")
    }

    res.status(200).json(new ApiResponse(200, submittedAnswer, "Submitted answer for the question"))
})

const getAllSubmittedSolutionsForAQuiz = asyncHandler(async(req, res) => {
    const quizCode = req.params.quizCode
    const userId = req.user._id

    console.log(quizCode, userId);
    if (!quizCode || !userId) {
        throw new ApiError(400, "Please provide both quiz code and user id.")
    }
    const solutions = await Solution.find({
        $and: [{quizCode}, {userId}]
    }).populate("questionId")

    res.status(200).json(new ApiResponse(200, solutions, "Solutions for requested quiz!"))
})

export {
    submitSolution,
    getsubmittedSolutionforAQuestion,
    getAllSubmittedSolutionsForAQuiz
}

