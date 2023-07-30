require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const { getSurveyById } = require('../controllers/surveyFunctions')
const verifyToken = require('./verifyToken');

const checkMakePublic = async (request, response, next) => {
    let responseData = await getSurveyById(request.params.id);
    request.responseData = responseData;
    if (responseData.makePublic === false) {
        verifyToken(request, response, next);
    } else {
        next();
    }
}

module.exports = checkMakePublic;