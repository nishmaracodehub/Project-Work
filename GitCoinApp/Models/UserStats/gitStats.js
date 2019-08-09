const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gitStatsSchema = new Schema({
    contributions: {
        type: Array,
    },
    total: {
        type: Number
    },
    balance: {
        type: Number
    },
    debits: {
        type: Number
    },
    lastCommit: {
        type: String
    }
})

module.exports = mongoose.model('GitUserStats', gitStatsSchema, 'gituserstats');