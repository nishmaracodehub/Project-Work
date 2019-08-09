const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOAuthSchema = new Schema({
    username: {
        type: String
    },
    displayName: {
        type: String
    },
    githubId: {
        type: String
    },
    emailId: {
        type: String
    },
    followers: {
        type: Number
    },
    following: {
        type: Number
    },
    displayImage: {
        type: String
    },
    profileUrl: {
        type: String
    },
    contributions: {
        type: Array,
    },
    total: {
        type: Number
    },
    balance: {
        type: Number
    },
    gitDebits: {
        type: Array
    },
    redeemCoins: {
        type: Array
    },
    redeemItems: {
        type: Array
    },
    lastCommit: {
        type: String
    }
})

module.exports = mongoose.model('GitOAthUsers', userOAuthSchema, 'gitoathusers');