const express = require('express');
const { getAllSurveys, getSurveyById, getSurveyByCreatorId } = require('./surveyFunctions');
const surveyRouter = express.Router();

// Routes
// All surveys
surveyRouter.get("/", async (request, response) => {
    responseData = await getAllSurveys();
    response.json({
        surveys: responseData
    });
});

// Survey by id
surveyRouter.get("/:id", async (request, response) => {
    responseData = await getSurveyById(request.params.id);
    response.json({
        survey: responseData
    });
});

// Survey submission message
surveyRouter.get("/:id/completed", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Thanks for completing the survey!"
    });
});

// Responses by survey id
surveyRouter.get("/:id/responses", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"View responses by survey id"
    });
});

// Surveys by creator id
surveyRouter.get("/createdby/:id", async (request, response) => {
    responseData = await getSurveyByCreatorId(request.params.id);
    response.json({
        survey: responseData
    });
});

// All responses
surveyRouter.get("/responses", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"View all responses"
    });
});

// Create survey
surveyRouter.post("/create", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Create a survey"
    });
});

// Edit survey
surveyRouter.post("/:id/edit", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Edit a survey"
    });
});

module.exports = surveyRouter;