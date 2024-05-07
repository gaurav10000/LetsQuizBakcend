import mongoose,{Schema} from 'mongoose';

const quizSchema = new Schema({
    quizCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    quizTitle: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        trim: true,
    },
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
        // required: true
    }
}, {timestamps: true});

export const Quiz = mongoose.model('Quiz', quizSchema);
