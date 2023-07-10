const ResponseSchema = new mongoose.Schema({
    survey: {
      type: mongoose.Types.ObjectId,
      ref: 'Survey',
      required: true
    },
    answers: [{
      question: {
        type: mongoose.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    }]
  });