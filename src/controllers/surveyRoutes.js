const express = require('express');
const jwt = require('jsonwebtoken');
const surveyRouter = express.Router();
const { getAllSurveys, getSurveyById, getSurveyByCreatorId, createSurvey, editSurvey } = require('./surveyFunctions');


// Routes
// All surveys
surveyRouter.get("/", async (request, response) => {
    let responseData = await getAllSurveys();
    response.json({
        surveys: responseData
    });
});

// Survey by id
surveyRouter.get("/:id", async (request, response) => {
    let responseData = await getSurveyById(request.params.id);
    response.json({
        survey: responseData
    });
});

// Survey submission message
surveyRouter.get("/:id/completed", async (request, response) => {
    let responseData = await getSurveyById(request.params.id);
    response.json({
        message: responseData.completionMessage
    });
});

// Middleware
// All routes below this point require JWT authentication
surveyRouter.use('/', (request, response, next) => {
    // Get authorization header from request and separate out token
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token send 401 unauthorized
    if (token == null) {
        return response.sendStatus(401)
    }
    // Verify the token
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
            console.log(error);
            // Send 403 forbidden if token could not be verfied
            return response.sendStatus(403)
        }
        // Add user identify to request
        request.user = user

        // Call next middleware
        next();
    })
})

// Surveys by creator id
surveyRouter.get("/createdby/:id", async (request, response) => {
    let responseData = await getSurveyByCreatorId(request.params.id);
    response.json({
        survey: responseData
    });
});

// Create survey
surveyRouter.post("/create", async (request, response) => {
    // TODO Add user identity to survey
    let createdSurvey = await createSurvey(request.body.surveyData)
    response.json({
        survey: createdSurvey
    });
});

// Edit survey
surveyRouter.post("/:id/edit", async (request, response) => {
    let editedSurvey = await editSurvey(request.params.id, request.body.surveyData)
    response.json({
        survey: editedSurvey
    });
});

// All responses
surveyRouter.get("/responses", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"View all responses"
    });
});

// Responses by survey id
surveyRouter.get("/:id/responses", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"View responses by survey id"
    });
});

module.exports = surveyRouter;