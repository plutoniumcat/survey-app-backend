const express = require('express');
const { getAllSurveys, getSurveyById, getSurveyByCreatorId, createSurvey, editSurvey } = require('./surveyFunctions');
const surveyRouter = express.Router();

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

// Surveys by creator id
surveyRouter.get("/createdby/:id", async (request, response) => {
    let responseData = await getSurveyByCreatorId(request.params.id);
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

// Create survey
surveyRouter.post("/create", async (request, response) => {
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