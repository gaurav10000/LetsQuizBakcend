import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addQuestionToQuiz, createQuiz, deleteQuiz, getActiveQuizzes, getQuizzesICreated, doesQuizExist, getUpcomingQuizzes, getQuizDetails } from '../controllers/quiz.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();


router.route('/createQuiz').post(verifyJWT, createQuiz)
router.route('/addQuestionToQuiz').put(verifyJWT, upload.fields([
    {
        name: "question",
        maxCount: 1,
    }
]), addQuestionToQuiz)


router.route('/activeQuizzes').get(verifyJWT, getActiveQuizzes)
router.route('/getQuizzesICreated').get(verifyJWT, getQuizzesICreated)
router.route('/deleteQuiz/:quizCode').delete(verifyJWT, deleteQuiz)
router.route('/doesQuizExist/:quizCode').get(verifyJWT, doesQuizExist)
router.route('/upcomingQuizzes').get(verifyJWT, getUpcomingQuizzes)
router.route('/getQuizDetails/:quizCode').get(verifyJWT, getQuizDetails)


export default router;