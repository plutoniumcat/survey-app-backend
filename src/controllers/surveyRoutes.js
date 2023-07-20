const express = require('express');
const jwt = require('jsonwebtoken');
const surveyRouter = express.Router();
const {User} = require('../models/userModel')
const { Survey } = require('../models/surveyModel');
const { getAllSurveys, getAllPublicSurveys, getSurveyById, getSurveyByCreatorId, createSurvey, editSurvey } = require('./surveyFunctions');
const { getUserIdFromUsername } = require('./userFunctions');
const verifyToken = require('../middleware/verifyToken');
const secretKey = process.env.SECRET_KEY;

// Middleware
// Determine whether a user is logged in or not
// surveyRouter.use('/', (request, response, next) => {
//     // Get authorization header from request and separate out token
    
//     const authHeader = request.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     // If there is no token set user to null and call next middleware
//     if (token == undefined) {
//         request.user = null
//         next();
//     }
//     // Verify the token
//     else {
//             jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
//                 if (error) {
//                     console.log(error);
//                     // TODO - How to show page as if the user is not logged in if token is invalid?
//                     // Send 403 forbidden if token could not be verfied
//                     return response.sendStatus(403)
//                 }
//                 // Add user identify to request
//                 request.user = user

//                 // Call next middleware
//                 next();
//         })
//     }
// })

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
// surveyRouter.use('/', (request, response, next) => {
//     if (!request.user) {
//         // 401 Unauthorized
//         return response.sendStatus(401)
//     }
//     next();
// })

// Index of survey creators
surveyRouter.get("/createdby/", async (request, response) => {
    //TODO List all users who have created a survey
    response.json({
        survey: responseData
    });
});

// Surveys by creator username
surveyRouter.get("/createdby/:username", async (request, response) => {
    let userId = await getUserIdFromUsername(request.params.username);
    let responseData = await getSurveyByCreatorId(userId);
    response.json({
        survey: responseData
    });
});

// Save new survey to db
surveyRouter.post('/create', verifyToken, async (request, response) => {
    const { authorization } = request.headers;
    
    // Extract the token from the Authorization header
    const token = authorization.split(' ')[1];
  
    let surveyData = request.body;
    console.log(surveyData)
  
    // get the _id from the JWT.
    const decoded = jwt.verify(token, secretKey);
    // Set author as userID
    surveyData.author = decoded._id
    
    try {
      // Save the survey to the database
      const savedSurvey = await createSurvey(surveyData);
      console.log('Survey saved successfully:', savedSurvey);
      response.status(200).json(savedSurvey);
    } catch (error) {
      console.error('Error saving survey to the database:', error);
      response.status(500).json({ error: 'Error saving survey to the database.' });
    }
  });

// Edit survey
surveyRouter.post("/:id/edit", async (request, response) => {
    let editedSurvey = await editSurvey(request.params.id, request.body)
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