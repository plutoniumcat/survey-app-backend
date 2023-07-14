const express = require('express');
const responseRouter = express.Router();
const {Response} = require('../models/responseModel')
const {Survey} = require("../models/surveyModel")

// View all survey responses.
responseRouter.get('/', async (request, response) => {
    try {
      let responseData = await Response.find({})
      response.json({
        responses: responseData
      });
    } catch (error) {
        console.log(error)
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  
// View all responses with a specific survey ID.

responseRouter.get("/survey/:id", async (request, response) => {
  try {
    const survey = await Survey.findById(request.params.id);

    if (!survey) {
      return response.status(404).json({ message: "Survey not found" });
    }

    const responses = await Response.find({ survey_id: request.params.id });

    response.json({ responses });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});


// View a specific response

responseRouter.get("/:responseid", async (request, response) => {
  try {
    const surveyResponse = await Response.findById(request.params.responseid);

    if (!surveyResponse) {
      return response.status(404).json({message: "Response not found"});
    } else {
      return response.json({response: surveyResponse})
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({error: "Internal server error."})
  }
})

// Post a response
responseRouter.post("/", async (request, response) => {
  try {
    const { surveyID, answers } = request.body;

    const survey = await Survey.findById(surveyID);

    if (!survey) {
      return response.status(404).json({ error: "Survey not found" });
    } // this realistically won't happen as the survey they are entering should handle this, however for testing. Also potential survey deletion while someone is doing it...

    // Create a new response
    const responseData = {
      survey_id: surveyID,
      answers: answers,
    };

    const createdResponse = await Response.create(responseData);

    // push response ID to survey responses array.
    survey.responses.push(createdResponse._id)
    await survey.save();

    response.json({ response: createdResponse });

  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = responseRouter;