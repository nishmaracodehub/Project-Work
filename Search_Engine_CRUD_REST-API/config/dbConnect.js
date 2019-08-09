const db = require('mongoose');
const mongodb = require('mongodb');

module.exports = db.connect('mongodb://nishmara:nish123@ds139944.mlab.com:39944/nishcloudapps', {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log("Error!! Database not Connected");
    } else {
        console.log("Database is Connected");
    }
});