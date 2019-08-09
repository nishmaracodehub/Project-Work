const db = require('mongoose');
const mongodb = require('mongodb');
const keys = require('./config/keys');

module.exports = db.connect(keys.mongodb.dbURI, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log("Error!! Database not Connected");
    } else {
        console.log("Database is Connected");
    }
});