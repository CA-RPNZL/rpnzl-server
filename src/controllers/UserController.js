const express = require("express");
const router = express.Router();
const { User } = require("../models/UserModel");
const { authAsAdminOrUser, authAsAdmin } = require("../functions/authorisation");
const { validateJwt } = require("../functions/authentication");

// Show all users
// Need admin authentication
// GET /users
router.get("/", validateJwt, authAsAdmin, async (request, response) => {
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
router.get("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
    const result = await User.findById(request.params.id);
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Create a new user
// No authentication needed
// POST /users
router.post("/", validateJwt, authAsAdminOrUser, async (request, response) => {
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
// Need admin authentication, or User authentication if own id
// DELETE /users/id/:id
router.delete("/id/:id", validateJwt, authAsAdminOrUser, async (request, response) => {
  try {
    const result = await User.findByIdAndDelete(request.params.id);
    response.json({ deletedUser: result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;