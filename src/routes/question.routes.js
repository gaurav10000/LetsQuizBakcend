import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addQuestion, getQuestion} from "../controllers/question.controller.js";

const router = Router();

router.route('/addQuestion').post(verifyJWT, addQuestion)
router.route('/getQuestion/:quizCode/:questionsToSkip/:questionsToFetch').get(verifyJWT, getQuestion)

export default router;
