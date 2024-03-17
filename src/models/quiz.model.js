import mongoose,{Schema} from 'mongoose';

const quizSchema = new Schema({
    quizCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    questions: [
        {
            _id: {
                type: Number,
                required: true,
                unique: true,
                index: true,
            },
            isMultiCorrect: {
                type: Boolean,
                required: true
            },
            question: {
                type: String, // this can be a text
                required: true,
                trim: true,
            },
            questionImage: { 
                type: String, // this will be a URL to the image
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
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    isLive: {
        type: Boolean,
        default: false,
        index: true
    },
    availableAfter: {
        type: Date,
        required: true
    },
    availableTill: {
        type: Date,
        required: true
    },
    totalTimeLimit: {
        type: Number, // it will be in minutes
        required: true
    }
}, {timestamps: true});

export const Quiz = mongoose.model('Quiz', quizSchema);
