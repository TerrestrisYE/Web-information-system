// define the question schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    tag: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const questionModel = mongoose.model('Question', questionSchema);
module.exports = { questionModel };