import mongoose, {Schema} from 'mongoose';

const questionSchema = new Schema({
    quizCode: {
        type: String,
        required: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    questionImage: {
        type: String,
        trim: true
    },
    options: [
        {
            option: {
                type: String,
                required: true,
                trim: true
            },
            isCorrect: {
                type: Boolean,
                default: false
            }
        }
    ]
})

export const Question = mongoose.model('Question', questionSchema);