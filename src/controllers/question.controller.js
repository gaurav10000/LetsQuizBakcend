


import { Question } from "../models/questions.model.js";



const addQuestion = async(req, res) => {
    try {
        const { quizCode, question, options } = req.body;
        const questionData = new Question({
            quizCode,
            question,
            options
        });
        const savedQuestion = await questionData.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getQuestion = async(req, res) => {
    try {
        // console.log(questionsToSkip);
        const {quizCode, questionsToSkip, questionsToFetch} = req.params;
        const questions = await Question.find({ quizCode: quizCode }).skip(questionsToSkip).limit(questionsToFetch);// .exec(); // used exec() to execute the query 

        if(questions.length === 0) {
            return res.status(404).json({ message: "No questions found for the quiz code provided" });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// const 

export {
    addQuestion,
    getQuestion,
}