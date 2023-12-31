const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  questionDetails: { type: String, required: false },
  questionType: String,
  questionOptions: [{ type: String }],
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  description: String,
  makePublic: { type: Boolean, default: false },
  introduction: String,
  completionMessage: String,
  reviewLink: { type: String, required: false },
  questions: {
    type: [QuestionSchema],
    required: false,
  },
  responses: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  reviewLink: String,
  dateSubmitted: { type: Date, default: null },
});

const Survey = mongoose.model('Survey', SurveySchema);

module.exports = { Survey };