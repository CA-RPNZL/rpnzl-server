// Import Express JS
const express = require("express");

// Import Mongoose
const mongoose = require("mongoose");

const { Service } = require("../models/ServiceModel");

// Create an instance of an Express Router
const router = express.Router();


// Show all services
// Doesn't need authentication
// GET /services
router.get("/", async (request, response) => {
  let result = await Service.find({});

  response.json(result);
});

// Show service by service id
// Doesn't need authentication

// Create a new service
// Need admin authentication

// Update an existing service
// Need admin authentication

// Delete a service
// Need admin authentication

module.exports = router;
