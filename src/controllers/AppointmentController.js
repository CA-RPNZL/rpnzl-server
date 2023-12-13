const express = require("express");
const router = express.Router();
const { Appointment } = require("../models/AppointmentModel");
const { Service } = require("../models/ServiceModel"); 

// const { authAsAdminOrUser, authAsAdmin, authAsHairstylist } = require("../functions/authorisation");
// const { validateJwt } = require("../functions/authentication");

// Get all appointments
// Need admin authentication
// GET /appointments
// router.get("/", async (request, response) => {
//     try {
//       const result = await Appointment.find({});
//       response.json(result);
//     } catch (error) {
//       response.status(500).json({ error: error.message });
//     }
//   });

  // GET Request with populated fields
  router.get("/", async (request, response) => {
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
// Need client, hairstylist or admin authentication
// GET /appointments/id/:id
router.get("/id/:id", async (request, response) => {
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



// Get appointments by hairstylist - show full details
// Needs hairstylist authentication
// GET /appointments/hairstylist/:hairstylistId
router.get("/hairstylist/:hairstylistId", async (request, response) => {
  try {
    const hairstylistId = request.params.hairstylistId;
    const appointments = await Appointment.find({ hairstylist: hairstylistId });
    
    response.json(appointments);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Get appointments by hairstylist - only show appointment ID, start date/time, end date/time
// Doesn't need authentication - used for booking availability
// GET /appointments?hairstylist=:hairstylistId
router.get("/hairstylist", async (request, response) => {
  try {
    // Grab the selected service from the query
    const selectedHairstylistId = request.query.hairstylist;

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

// Get appointments by user ID
// Need User authentication
// GET /appointments/user/:huserId
router.get("/user/:userId", async (request, response) => {
  try {
    const userId = request.params.userId;
    const appointments = await Appointment.find({ client: userId });
    
    response.json(appointments);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Create a new appointment
// Need client, hairstylist or admin authentication
// Create a new appointment
// POST /appointments
router.post("/", async (request, response) => {
  try {
      let newAppointment = await Appointment.create(request.body);
      response.status(201).json(newAppointment);
  } catch (error) {
      response.status(500).json({ error: error.message });
  }
});


// Update an existing appointment by ID
// Need client, hairstylist or admin authentication
// PATCH /appointments/id/:id
router.patch("/id/:id", async (request, response) => {
  // Show updated service
  let result = await Appointment.findByIdAndUpdate(request.params.id, request.body, { returnDocument: "after" }).catch(error => error);

  response.json({
      updatedAppointment: result
  });
});

// Delete appointment by id
// Need client, hairstylist or admin authentication
// DELETE /appointments/id/:id
router.delete("/id/:id", async (request, response) => {
  let result = await Appointment.findByIdAndDelete(request.params.id);

  response.json({
      deletedAppointment: result
  });
});
  
  module.exports = router;