import mongoose, {Schema} from 'mongoose';

const resultSchema = new Schema({
    quizCode: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    }
})

export const Result = mongoose.model('Result', resultSchema);