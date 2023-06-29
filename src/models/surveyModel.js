const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: String,
    questionType: String,
    questionOptions: [{
        type: String
    }]
});

const SurveySchema = new mongoose.Schema({
    name: String,
    author: {type: mongoose.Types.ObjectId, ref: 'User'},
    description: String,
    makePublic: Boolean,
    introduction: String,
    completionMessage: String,
    questions: {
        type: [QuestionSchema],
        required: false
    }
});

const Survey = mongoose.model('Survey', SurveySchema);

module.exports = {Survey};