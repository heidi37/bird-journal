const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  date: {
    type: String, // Consider using Date type for better date handling
    required: true,
  },
  commonName: {
    type: String,
    required: true,
  },
  latinName: {
    type: String,
    default: "Unknown", // Default value for latinName
  },
  observations: {
    type: String,
    default: "No observations", // Default value for observations
  },
  funFact: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    default: "https://www.allaboutbirds.org/guide/"
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  cloudinaryId: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Entry', EntrySchema, 'entries');
