import mongoose, {Schema} from "mongoose";


const solutionSchema = new Schema({
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quizCode: {
        type: String,
        required: true,
        trim: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
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
            },
            isSelected: {
                type: Boolean,
                default: false
            }
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    isCorrect: {
        type: Boolean,
        default: false
    },    
}, {timestamps: true})

export const Solution = mongoose.model("Solution", solutionSchema)