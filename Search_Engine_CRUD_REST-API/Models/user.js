const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  patientName: {
    type: String
  },
  patientEmail: {
    type: String
  },
  bodyPart: {
    type: String
  },
  surgeryType: {
    type: String
  },
  fileUpload: {
    type: Boolean
  },
  patientAge: {
    type: Number
  },
  patientPhone: {
    type: Number
  }
});

module.exports = mongoose.model("User", userSchema, "patientData");
