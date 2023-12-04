const express = require("express");
const router = express.Router();
const { Appointment } = require("../models/AppointmentModel");

// Get all appointments
// GET /appointments
router.get("/", async (request, respond) => {
    try {
      const result = await Appointment.find({});
      respond.json(result);
    } catch (error) {
      respond.status(500).json({ error: error.message });
    }
  });
  
// Get appointment by ID
// GET /appointments/id/:id
router.get("/id/:id", async (request, respond) => {
  try {
    const result = await Appointment.findById(request.params.id);
    if (!result) {
      return respond.status(404).json({ message: "Appointment not found" });
    }
      respond.json(result);
    } catch (error) {
      respond.status(500).json({ error: error.message });
    } 
});

// Delete appointment by id
// Need user or admin authentication
// DELETE /appointments/id/:id
router.delete("/id/:id", async (request, response) => {
  let result = await Appointment.findByIdAndDelete(request.params.id);

  response.json({
      deletedAppointment: result
  });
});
  
  module.exports = router;