import { Router } from "express";
import { getAllSubmittedSolutionsForAQuiz, getsubmittedSolutionforAQuestion, submitSolution, getQuizSolutionsOfAStudent } from "../controllers/solution.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()



router.route('/submitSolution').post(verifyJWT ,submitSolution)
router.route('/getsubmittedSolutionforAQuestion/:quizCode/:questionId').get(verifyJWT, getsubmittedSolutionforAQuestion)
router.route('/getSubmittedSolutionsForAQuiz/:quizCode').get(verifyJWT, getAllSubmittedSolutionsForAQuiz)
router.route('/getQuizSolutionsOfAStudent/:quizCode/:userId').get(verifyJWT, getQuizSolutionsOfAStudent)


export default router