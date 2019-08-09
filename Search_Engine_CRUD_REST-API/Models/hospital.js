const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalData = new Schema({
    surgeryType: {
        type: String
    },
    hospitalName: {
        type: String
    },
    doctorName: {
        type: String
    },
    phone: {
        type: Number
    },
    city: {
        type: String
    },
    price: {
        type: String
    }
});

module.exports = mongoose.model('Hospitals', hospitalData, 'hospitalList')
