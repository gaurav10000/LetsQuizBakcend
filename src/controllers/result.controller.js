import { Result } from "../models/results.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getMyResult = asyncHandler(async(req, res) => {
    const {quizCode} = req.params
    const userId = req.user._id
    const result = await Result.findOne({
        $and: [{quizCode}, {userId}]
    })
    // console.log(result, quizCode, userId);

    if (!result) {
        return res.status(200).json(new ApiResponse(200, {}, "Not attempted the quiz yet"))
    }

    if (result.done) {
        throw new ApiError(409, "Already attempted the quiz!")
    }

    res.status(200).json(new ApiResponse(200, {}, "Not attempted the quiz yet"))
})

const getQuizzesIAttempted = asyncHandler(async(req, res) => {
    const userId = req.user._id
    console.log(userId);
    const quizzes = await Result.find({userId}).populate("quizId")
    console.log(quizzes);

    res.status(200).json(new ApiResponse(200, quizzes, "Quizzes attempted by user"))
})

const doneWithQuiz = asyncHandler(async(req, res) => {
    const {quizCode} = req.params
    const userId = req.user._id
    const result = await Result.findOneAndUpdate({
        $and: [{quizCode}, {userId}]
    }, {done: true})
    console.log(result);

    if (!result) {
        throw new ApiError(404, "No such quiz found!")
    }

    res.status(200).json(new ApiResponse(200, {}, "Done with the quiz!"))
})

const fetchLeaderboard = asyncHandler(async(req, res) => {
    const quizCode = req.params.quizCode

    if (!quizCode) {
        throw new ApiError(400, "Please provide quizCode!")
    }

    const leaderboard = await Result.find({quizCode}).sort({score: -1}).populate("userId")

    res.status(200).json(new ApiResponse(200, leaderboard, "Here is the leaderboard!"))
})

export {
    getMyResult,
    getQuizzesIAttempted,
    doneWithQuiz,
    fetchLeaderboard
}