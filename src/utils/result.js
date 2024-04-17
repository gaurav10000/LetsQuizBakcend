import { Result } from "../models/results.model.js";

const StudentQuizResult = async (quizCode, userId, quizId, score) => {
    const result = await Result.findOne({ quizCode, userId });
    console.log(result);
    if (!result) {
        // console.log(quizCode, userId, score);
        // console.log('creating new result');
        return await Result.create({ quizCode, userId, quizId, score });
    }
    // console.log(quizCode, userId, score);
    // console.log('updating result');
    return await Result.findByIdAndUpdate(result._id, { score: result.score + score });
}

export default StudentQuizResult;