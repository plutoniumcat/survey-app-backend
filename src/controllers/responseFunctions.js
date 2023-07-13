const { Response } = require('../models/responseModel');

// GET survey functions
async function getAllResponses() {
    return await Response.find({})
};

async function getResponseById(id) {
    return await Response.findById(id)
};

async function getResponsesBySurveyId(id) {
    return await Response.find({survey_id: id})
};

//POST survey functions
async function createResponse(surveyData) {
    return await Response.create(surveyData);
}



module.exports = {
    getAllResponses,
    getResponseById,
    getResponsesBySurveyId,
    createResponse
}