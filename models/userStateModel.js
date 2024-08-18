const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the UserState schema
const userStateSchema = new Schema({
  userPhoneNumber: {
    type: String,
    maxlength: 50,
    trim: true,
    required: true,
    unique: true,
  },
  userFaculty: {
    type: String,
    maxlength: 50,
    trim: true,
    default: null
  },
  currentStep: {
    type: Number,
    default: -1
  }
}, { timestamps: true });

// Create the UserState model
const UserState = mongoose.model('UserState', userStateSchema);

module.exports = UserState;
