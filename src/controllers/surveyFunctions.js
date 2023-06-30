//Import models
const { Survey } = require('../models/surveyModel');
const { User } = require('../models/userModel');

async function getAllSurveys() {
    return await Survey.find({})
};

async function getSurveyById(id) {
    return await Survey.findById(id)
};

async function getSurveyByCreatorId(id) {
    return await Survey.find({author: id})
};

module.exports = {
    getAllSurveys,
    getSurveyById,
    getSurveyByCreatorId
}