const express = require("express");
const router = express.Router();
const { Appointment } = require("../models/AppointmentModel");
const { authAsAdminOrUser, authAsAdmin, authAsHairstylist } = require("../functions/authorisation");
const { validateJwt } = require("../functions/authentication");

// Get all appointments
// GET /appointments
router.get("/", validateJwt, authAsAdmin, async (request, response) => {
    try {
      const result = await Appointment.find({});
      response.json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  
// Get appointment by ID
// GET /appointments/id/:id
router.get("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
    const result = await Appointment.findById(request.params.id);
    if (!result) {
      return response.status(404).json({ message: "Appointment not found" });
    }
      response.json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    } 
});


// Get appointments by hairstylist ID
// Need Hairstylist authentication
// GET /appointments/hairstylist/:hairstylistId
router.get("/hairstylist/:hairstylistId", validateJwt, authAsHairstylist, async (request, response) => {
  try {
    const hairstylistId = request.params.hairstylistId;
    const appointments = await Appointment.find({ hairstylist: hairstylistId });
    
    response.json(appointments);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Create a new appointment
// Need user or admin authentication
// POST /appointments
router.post("/", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
      let newAppointment = await Appointment.create(request.body);
      response.status(201).json(newAppointment);
  } catch (error) {
      response.status(500).json({ error: error.message });
  }
});


// Update an existing appointment by ID
// Need user or admin authentication
// PATCH /appointments/id/:id
router.patch("/id/:id", validateJwt, authAsAdminOrUser,  async (request, response) => {
  // Show updated service
  let result = await Appointment.findByIdAndUpdate(request.params.id, request.body, { returnDocument: "after" }).catch(error => error);

  response.json({
      updatedAppointment: result
  });
});

// Delete appointment by id
// Need user or admin authentication
// DELETE /appointments/id/:id
router.delete("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  let result = await Appointment.findByIdAndDelete(request.params.id);

  response.json({
      deletedAppointment: result
  });
});
  
  module.exports = router;