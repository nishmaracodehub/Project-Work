const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOAuthSchema = new Schema({
    username: {
        type: String
    },
    googleId: {
        type: String
    },
    twitterId: {
        type: String
    },
    linkedinId: {
        type: String
    },
    emailId: {
        type: String
    }
})

module.exports = mongoose.model('OAthUsers', userOAuthSchema, 'oathusers');