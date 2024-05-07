import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { doneWithQuiz, fetchLeaderboard, getQuizzesIAttempted, getMyResult } from '../controllers/result.controller.js';


const router = Router()


router.route('/getMyResult/:quizCode').get(verifyJWT, getMyResult)
router.route('/getQuizzesIAttempted').get(verifyJWT, getQuizzesIAttempted)
router.route('/fetchLeaderboard/:quizCode').get(verifyJWT, fetchLeaderboard)
router.route('/doneWithQuiz/:quizCode').put(verifyJWT, doneWithQuiz)

export default router