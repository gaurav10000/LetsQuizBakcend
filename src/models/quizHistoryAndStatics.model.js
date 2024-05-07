import mongoose, {Schema} from 'mongoose';

const quizStatisticsSchema = new Schema({
    quizCode: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    answers: {
        questionId: {
            type: Number,
            required: true
        },
        optionsSelected: {
            type: Array,
            required: true
        }
    }
})

export const quizStatistics = mongoose.model("quizStatistics", quizStatisticsSchema)

