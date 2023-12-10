const express = require("express");
const router = express.Router();
const { User } = require("../models/UserModel");
// const { authAsAdminOrUser, authAsAdmin } = require("../functions/authorisation");
// const { validateJwt } = require("../functions/authentication");

// Show all users
// Need admin authentication
// GET /users
router.get("/", async (request, response) => {
  try {
    const result = await User.find({});
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Show user by user id
// Need User authentication, or User authentication if own id
// GET /users/id/:id
router.get("/id/:id", async (request, response) => {
  try {
    const result = await User.findById(request.params.id);
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Show users that are hairstylists
// Only show the first name and last name
// GET /users/hairstylists?service=:id
router.get("/hairstylists", async (request, response) => {
  try {
    const selectedServiceId = request.query.service;

    // If a service is selected
    if (selectedServiceId) {
      query = { is_hairstylist: true, services: selectedServiceId };
    } else {
      query = { is_hairstylist: true }
    }

    const result = await User.find(query).select("firstName lastName services");
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message});
  }
});

// // Show users that are hairstylists filtered by services
// // Only show the first name and last name
// // GET /users/hairstylists
// router.get("/hairstylists", async (request, response) => {
//   try {
//     const result = await User.find({ is_hairstylist: true}).select("firstName lastName services");
//     response.json(result);
//   } catch (error) {
//     response.status(500).json({ error: error.message});
//   }
// });

// Create a new user
// No authentication needed
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
// Need admin authentication, or User authentication if own id
// PATCH /users/id:id
router.patch("/id/:id", async (request, response) => {
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
// Need admin authentication, or User authentication if own id
// DELETE /users/id/:id
router.delete("/id/:id", async (request, response) => {
  try {
    const result = await User.findByIdAndDelete(request.params.id);
    response.json({ deletedUser: result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;