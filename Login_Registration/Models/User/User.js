const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema, 'userlogindata');