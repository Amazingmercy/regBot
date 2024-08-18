const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define the regStep schema
const regStepSchema = new Schema({
  faculty: {
    type: String,
    maxlength: 50,
    trim: true,
    required: true,
    unique: true
  },
  steps: {
    type: [String],
    required: true
  }
});



// Create the regStep model
const RegStep = mongoose.model('RegStep', regStepSchema);

module.exports = RegStep;
