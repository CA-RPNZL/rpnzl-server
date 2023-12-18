// Import Express JS
const express = require("express");

// Create an instance of an Express Router
const router = express.Router();

// Import Appointment model
const { Appointment } = require("../models/AppointmentModel");

// Import Service model
const { Service } = require("../models/ServiceModel"); 

// Import middleware
const { validateJwt } = require("../functions/authentication");
const { authAsAdminOrUser, authAsAdmin, authAsHairstylist } = require("../functions/authorisation");


// Show all appointments
// Request with populated client, hairstylist, service fields
// Need admin auth
// GET /appointments
router.get("/", validateJwt, authAsAdmin, async (request, response) => {
  try {
    // Ensure that the "Service" model is registered before using it
    await Service.find(); // This is a simple check to ensure the model is registered
    
    // Now you can use populate with the "Service" model
    const result = await Appointment.find({})
    .populate('client', 'firstName lastName') // Populate client with firstName and lastName fields
    .populate('hairstylist', 'firstName') // Populate hairstylist with firstName field
    .populate('service', 'name'); // Populate service with name field
    
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Get appointment by ID
// Need client, hairstylist or admin auth
// GET /appointments/id/:id
router.get("/id/:apptId", validateJwt, async (request, response) => {
  try {
    const result = await Appointment.findById(request.params.apptId)
    .populate("client", "firstName lastName")
    .populate("service", "name duration")
    .populate("hairstylist", "firstName lastName services");
    if (!result) {
      return response.status(404).json({ message: "Appointment not found" });
    }
      response.json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    } 
});


// User portal - get appointments by hairstylist (filter by past appts)
// Needs admin or hairstylist auth
// GET /appointments/hairstylist/:hairstylistId?pastAppt=:true/false
router.get("/hairstylist/:hairstylistId", validateJwt, async (request, response) => {
  try {
    // Check whether past appointments should be included
    const pastAppt = request.query.pastAppt;

    // Grab the user id from parameters
    const hairstylistId = request.params.hairstylistId;

    // Get current date
    const currentDate = new Date();

    let appointments;

    if (pastAppt === "false") {
      // Do not grab appointments that have passed
      appointments = await Appointment.find({ hairstylist: hairstylistId })
      .populate("service", "name")
      .populate("hairstylist", "firstName lastName")
      .populate("client", "firstName lastName mobileNumber")
      .sort({ startDateTime: "asc"})
      .where("startDateTime").gte(currentDate);
    } else {
      // Grab all appointments
      appointments = await Appointment.find({ hairstylist: hairstylistId })
      .populate("service", "name")
      .populate("hairstylist", "firstName lastName")
      .populate("client", "firstName lastName mobileNumber")
      .sort({ startDateTime: "asc"});
    }
    
    response.json(appointments);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Get appointments by hairstylist - only show appointment ID and start/end date/time
// Doesn't need auth - used for booking availability
// GET /appointments/hairstylistdate/:hairstylistId
router.get("/hairstylistdate/:hairstylistId", async (request, response) => {
  try {
    // Grab the user id from parameters
    const selectedHairstylistId = request.params.hairstylistId;

    // If a service is selected
    if (selectedHairstylistId) {
      // Show hairstylists filtered by selected service
      query = { hairstylist: selectedHairstylistId };
    }
    
    const appointments = await Appointment.find(query).select("startDateTime endDateTime");
    response.json(appointments);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// User portal - get appointments by client (filter by past appts)
// Need admin or client auth
// GET /appointments/user/:userId?pastAppt=:true/false
router.get("/user/:userId", validateJwt, async (request, response) => {
  try {
    // Check whether past appointments should be included
    const pastAppt = request.query.pastAppt;

    // Grab the user id from parameters
    const userId = request.params.userId;

    // Get current date
    const currentDate = new Date();

    let appointments;

    if (pastAppt === "false") {
      // Do not grab appointments that have passed
      appointments = await Appointment.find({ client: userId })
      .populate("service", "name")
      .populate("hairstylist", "firstName lastName")
      .sort({ startDateTime: "asc"})
      .where("startDateTime").gte(currentDate);
    } else {
      // Grab all appointments
      appointments = await Appointment.find({ client: userId })
      .populate("service", "name")
      .populate("hairstylist", "firstName lastName")
      .sort({ startDateTime: "asc"});
    }
    
    response.json(appointments);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Create a new appointment
// Need client, hairstylist or admin auth
// Create a new appointment
// POST /appointments
router.post("/", validateJwt, async (request, response) => {
  try {
      let newAppointment = await Appointment.create(request.body);
      response.status(201).json(newAppointment);
  } catch (error) {
      response.status(500).json({ error: error.message });
  }
});


// Update an existing appointment by ID
// Need client, hairstylist or admin auth
// PATCH /appointments/id/:id
router.patch("/id/:id", validateJwt, async (request, response) => {
  // Show updated service
  let result = await Appointment.findByIdAndUpdate(request.params.id, request.body, { returnDocument: "after" }).catch(error => error);

  response.json({
      updatedAppointment: result
  });
});


// Delete appointment by id
// Need client, hairstylist or admin auth
// DELETE /appointments/id/:id
router.delete("/id/:id", validateJwt, async (request, response) => {
  let result = await Appointment.findByIdAndDelete(request.params.id);

  response.json({
      deletedAppointment: result
  });
});


module.exports = router;