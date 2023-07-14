const express = require('express');
const jwt = require('jsonwebtoken');
const responseRouter = express.Router();
const {Response} = require('../models/responseModel')
const {getAllResponses, getResponsesBySurveyId, getResponseById} = require('./responseFunctions');
const {getSurveyById} = require("./surveyFunctions")
const verifyToken = require('../middleware/verifyToken');


// Routes

// View all survey responses.
responseRouter.get('/', async (request, response) => {
    try {
      let responseData = await getAllResponses();
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
    const survey = await getSurveyById(request.params.id);

    if (!survey) {
      return response.status(404).json({ message: "Survey not found" });
    }

    const responses = await Response.find({ _id: { $in: survey.responses } });

    response.json({ responses });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

// View a specific response

responseRouter.get("/:responseid", async (request, response) => {
  try {
    const surveyResponse = await getResponseById(request.params.responseid);

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






// --------------------





// // Survey by id
// surveyRouter.get("/:id", async (request, response) => {
//     let responseData = await getSurveyById(request.params.id);
//     response.json({
//         survey: responseData
//     });
// });

// // Survey submission message
// surveyRouter.get("/:id/completed", async (request, response) => {
//     let responseData = await getSurveyById(request.params.id);
//     response.json({
//         message: responseData.completionMessage
//     });
// });

// // Middleware
// // Allow only authenticated users below this point
// surveyRouter.use('/', (request, response, next) => {
//     if (!request.user) {
//         // 401 Unauthorized
//         return response.sendStatus(401)
//     }
//     next();
// })

// // Index of survey creators
// surveyRouter.get("/createdby/", async (request, response) => {
//     //TODO List all users who have created a survey
//     response.json({
//         survey: responseData
//     });
// });

// // Surveys by creator username
// surveyRouter.get("/createdby/:username", async (request, response) => {
//     let userId = await getUserIdFromUsername(request.params.username);
//     let responseData = await getSurveyByCreatorId(userId);
//     response.json({
//         survey: responseData
//     });
// });

// // Create survey
// surveyRouter.post("/create", async (request, response) => {
//     // Add current user identity to submitted survey data
//     authorId = await getUserIdFromUsername(request.user.username);
//     request.body.surveyData.author = authorId;
//     let createdSurvey = await createSurvey(request.body.surveyData);
//     response.json({
//         survey: createdSurvey
//     });
// });

// // Edit survey
// surveyRouter.post("/:id/edit", async (request, response) => {
//     let editedSurvey = await editSurvey(request.params.id, request.body.surveyData)
//     response.json({
//         survey: editedSurvey
//     });
// });

// // All responses
// surveyRouter.get("/responses", async (request, response) => {
//     // TODO Add functionality
//     response.json({
//         message:"View all responses"
//     });
// });

// // Responses by survey id
// surveyRouter.get("/:id/responses", async (request, response) => {
//     // TODO Add functionality
//     response.json({
//         message:"View responses by survey id"
//     });
// });

module.exports = responseRouter;