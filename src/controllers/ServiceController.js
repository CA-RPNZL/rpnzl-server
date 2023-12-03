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
// GET /services/id/:id
router.get("/id/:id", async (request, response) => {
    let result = await Service.findById(request.params.id);

    response.json(result);
});

// Create a new service
// Need admin authentication
// POST /services
router.post("/", async (request, response) => {
    let newService = await Service.create(request.body).catch(error => error);

    response.json(newService);
});

// Update an existing service by id
// Need admin authentication
// PATCH /services/id:id
router.patch("/id/:id", async (request, response) => {
    // Show updated service
    let result = await Service.findByIdAndUpdate(request.params.id, request.body, { returnDocument: "after" }).catch(error => error);

    response.json({
        updatedService: result
    });
});

// Delete a service by id
// Need admin authentication
// DELETE /services/id/:id
router.delete("/id/:id", async (request, response) => {
    let result = await Service.findByIdAndDelete(request.params.id);

    response.json({
        deletedService: result
    });
});

module.exports = router;
