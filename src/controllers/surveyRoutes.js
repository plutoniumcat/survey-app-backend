const express = require('express');
const jwt = require('jsonwebtoken');
const surveyRouter = express.Router();
const { getAllSurveys, getAllPublicSurveys, getSurveyById, getSurveyByCreatorId, createSurvey, editSurvey } = require('./surveyFunctions');

// Middleware
// Determine whether a user is logged in or not
surveyRouter.use('/', (request, response, next) => {
    // Get authorization header from request and separate out token
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token set user to null
    if (token == null) {
        request.user = null
        next();
    }
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            console.log(error);
            // TODO - How to show page as if the user is not logged in if token is invalid?
            // Send 403 forbidden if token could not be verfied
            return response.sendStatus(403)
        }
        // Add user identify to request
        request.user = user

        // Call next middleware
        next();
    })
})

// Routes
// All surveys
surveyRouter.get("/", async (request, response) => {
    // If user is logged in, display all surveys
    if (request.user) {
        let responseData = await getAllSurveys();
        response.json({
            surveys: responseData
        });
    }
    // If user is not logged in, display only surveys marked as public
    else {
        let responseData = await getAllPublicSurveys();
        response.json({
            surveys: responseData
        });
    }
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
// Allow only authenticated users below this point
surveyRouter.use('/', (request, response, next) => {
    if (!request.user) {
        // 401 Unauthorized
        return response.sendStatus(401)
    }
    next();
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
    // Add current user identity to submitted survey data
    request.body.surveyData.author = request.user
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