// Import Express JS
const express = require("express");

// Create an instance of an Express Router
const router = express.Router();

// Import Mongoose
const mongoose = require("mongoose");

// Import Service model
const { Service } = require("../models/ServiceModel");

// Import middleware
const { validateJwt } = require("../functions/authentication");
const { authAsAdmin } = require("../functions/authorisation");


// Show all services
// Doesn't need auth
// GET /services
router.get("/", async (request, response) => {
    try {
        let result = await Service.find({});
        response.json(result);
    } catch (error) {
        response.status(500).json({
            error: error
        })
    };
});


// Show service by service id
// Doesn't need auth
// GET /services/id/:id
router.get("/id/:id", async (request, response) => {
    try {
        let result = await Service.findById(request.params.id);
        response.json(result);
    } catch (error) {
        response.status(500).json({
            error: error
        })
    };
});


// Create a new service
// Need admin auth
// POST /services
router.post("/", validateJwt, authAsAdmin, async (request, response) => {
    try {
        let newService = await Service.create(request.body);
        response.status(201).json(newService);
    } catch (error) {
        response.status(500).json({
            error: error
        })
    };
});


// Update an existing service by id
// Need admin auth
// PATCH /services/id/:id
router.patch("/id/:id", validateJwt, authAsAdmin, async (request, response) => {
    try {
        // Show updated service
        let result = await Service.findByIdAndUpdate(request.params.id, request.body, { returnDocument: "after" });

        response.json({
            updatedService: result
        });
    } catch (error) {
        response.status(500).json({
            error: error
        });
    };
});


// Delete a service by id
// Need admin auth
// DELETE /services/id/:id
router.delete("/id/:id", validateJwt, authAsAdmin, async (request, response) => {
    try {
        let result = await Service.findByIdAndDelete(request.params.id);
    
        response.json({
            deletedService: result
        });
    } catch (error) {
        response.status(500).json({
            error: error
        })
    }
});


module.exports = router;