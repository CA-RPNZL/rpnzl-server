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
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
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
      required: false,
    },
  });
  
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Export Appointment model
module.exports = {
  Appointment,
};