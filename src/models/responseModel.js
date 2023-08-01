const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  survey_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  answers: [
    {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  ],
});

const Response = mongoose.model('Response', ResponseSchema);

module.exports = { Response };