const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    notes: [{type: mongoose.Types.ObjectId, ref: 'Survey'}]
})

const User = mongoose.model('User', UserSchema)

module.exports = User