// define the answer schema
const mongoose = require('mongoose');
const answerSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    answerContent: {
        type: String,
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }

})

const answerModel = mongoose.model('Answer', answerSchema);
module.exports = { answerModel };