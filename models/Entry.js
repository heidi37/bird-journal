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
    required: true,
  },
  observations: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Optional if some entries might not have images
  },
  reference: {
    type: String,
    required: false, // Optional if some entries might not have references
  },
  likes: {
    type: Number,
    default: 0, // Default value for likes
  },
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
