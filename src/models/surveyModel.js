const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  questionType: String,
  questionOptions: [{
    type: String
  }]
});

const SurveySchema = new mongoose.Schema({
  title: [{ type: String, required: true }],
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  description: String,
  makePublic: { type: Boolean, default: false },
  introduction: String,
  completionMessage: String,
  questions: {
    type: [QuestionSchema],
    required: false
  },
    title: {type: String, required: true},
    author: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    description: String,
    makePublic: {type: Boolean, default: false},
    introduction: String,
    completionMessage: String,
    questions: {
        type: [QuestionSchema],
        required: false
    },
    responses: {
        type: [mongoose.Types.ObjectId],
        default: []
      },
    reviewLink: String
});

const Survey = mongoose.model('Survey', SurveySchema);

module.exports = { Survey };
