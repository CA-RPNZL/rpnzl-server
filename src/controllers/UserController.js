// Import Express JS
const express = require("express");

// Create an instance of an Express Router
const router = express.Router();

// Import User model
const { User } = require("../models/UserModel");

// Import Appointment model
const { Appointment } = require("../models/AppointmentModel");


// Import middleware
const { validateJwt } = require("../functions/authentication");
const { authAsAdminOrUser, authAsAdmin } = require("../functions/authorisation");


// Show all users
// Need admin auth
// GET /users
router.get("/", validateJwt, authAsAdmin, async (request, response) => {
  try {
    const result = await User.find({}).select("-password");
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Show user by user id
// Need admin auth or user auth if own id
// GET /users/id/:id
router.get("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
    const result = await User.findById(request.params.id);
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Show users that are hairstylists
// Only show the first name, last name and service
// No auth needed
// GET /users/hairstylists?service=:id
router.get("/hairstylists", async (request, response) => {
  try {
    // Grab the selected service from the query
    const selectedServiceId = request.query.service;

    // If a service is selected
    if (selectedServiceId) {
      // Show hairstylists filtered by selected service
      query = { is_hairstylist: true, services: selectedServiceId };
    } else {
      // No service selected - show all hairstylists
      query = { is_hairstylist: true }
    }

    const result = await User.find(query).select("firstName lastName services");
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message});
  }
});


// Create a new user
// No auth needed
// POST /users
router.post("/", async (request, response) => {
  try {
    const newUser = await User.create(request.body);
    response.json(newUser);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Update an existing user by id
// Need admin auth, or user auth if own id
// PATCH /users/id:id
router.patch("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
    const result = await User.findByIdAndUpdate(
      request.params.id,
      request.body,
      { returnDocument: "after" }
    );
    response.json({ updatedUser: result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


// Delete a user by id
// Need admin auth or user auth if own id
// DELETE /users/id/:id
router.delete("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
    const userId = request.params.id;

    // Delete future appointments with the hairstylist
    await Appointment.deleteMany({
      client: userId,
      startDateTime: { $gte: new Date() }
    });

    // Delete the user account
    const deletedUser = await User.findByIdAndDelete(userId);

    response.json({ deletedUser, message: 'User account and future appointments deleted successfully.' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


module.exports = router;