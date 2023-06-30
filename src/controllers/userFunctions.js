//Import models
const { Survey } = require('../models/surveyModel');
const { User } = require('../models/userModel');

async function getUserIdFromUsername(username) {
    user = await User.findOne({username: username});
    return user._id
};

module.exports = {getUserIdFromUsername}