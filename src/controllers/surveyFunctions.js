//Import models
const { Survey } = require('../models/surveyModel');
const { User } = require('../models/userModel');

// GET survey functions
async function getAllSurveys() {
    return await Survey.find({})
};

async function getSurveyById(id) {
    return await Survey.findById(id)
};

async function getSurveyByCreatorId(id) {
    return await Survey.find({author: id})
};

//POST survey functions
async function createSurvey(surveyData) {
    return await Survey.create(surveyData);
}

async function editSurvey(id, surveyData) {
    return await Survey.findByIdAndUpdate(id, surveyData, {returnDocument: 'after'})
}

module.exports = {
    getAllSurveys,
    getSurveyById,
    getSurveyByCreatorId,
    createSurvey,
    editSurvey
}