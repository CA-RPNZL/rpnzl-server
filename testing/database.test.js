// //  Import Supertest
const supertest = require("supertest");

// Import Mongoose
const mongoose = require("mongoose");

// Import and configure dotenv
require("dotenv").config();

// // Import app
var {app} = require("../src/server.js");

// // Import database
var {dbConnect, dbDisconnect} = require("../src/database.js");

// Mock Mongoose
// Connections to mongoose will be mocks
jest.mock("mongoose");


// Reset any mocks before each test
beforeAll(async () => {
    jest.resetModules();
});


describe("Database connection", () => {
    // Test environment = development
    it("should connect to the development DB URI", async () => {
        process.env.NODE_ENV = "development";
        const response = await dbConnect();

        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/rpnzl");
    });

    // Test environment = production
    it("should connect to the production DB URI", async () => {
        process.env.NODE_ENV = "production";
        const response = await dbConnect();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_URI);
    });

    // Test environment = test
    it("should connect to the test DB URI", async () => {
        process.env.NODE_ENV = "test";
        const response = await dbConnect();

        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/rpnzl");
    });
});