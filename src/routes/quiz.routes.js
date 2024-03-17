import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addQuestionToQuiz, createQuiz } from '../controllers/quiz.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();


router.route('/createQuiz').post(verifyJWT, createQuiz)
router.route('/addQuestionToQuiz').put(verifyJWT, upload.fields([
    {
        name: "question",
        maxCount: 1,
    }
]), addQuestionToQuiz)






export default router;