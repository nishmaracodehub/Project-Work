const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        type: String,

    },
    lname: {
        type: String,

    },
    email: {
        type: String,

    },
    phone: {
        type: Number,

    },
    password: {
        type: String,

    },
    profileimage: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false,

    },
    token: {
        type: String,

    }
});

module.exports = mongoose.model('User', userSchema, 'userlogindata');