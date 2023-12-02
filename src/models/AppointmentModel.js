// Import Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Appointment schema
const AppointmentSchema = new Schema({
    client: {
        // Using User model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    hairstylist: {
        // Using User model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
        // Using Service model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  });
  
  const Appointment = mongoose.model('Appointment', AppointmentSchema);
  
  // Export Apppointment model
  module.exports = {
    Appointment,
  };