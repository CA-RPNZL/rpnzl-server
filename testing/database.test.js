// //  Import Supertest
const request = require("supertest");

// Import Mongoose
const mongoose = require("mongoose");

// // Import app
var {app} = require("../src/server.js")

// // Import database
var {dbConnect, dbDisconnect} = require("../src/database.js");



describe("Database connection", () => {
    it("should connect to the development DB URI", async () => {
        process.eventNames.NODE_ENV = "developement";
        await dbConnect();

        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/rpnzl")
    });
    
    it("should successfully connect to database", async () => {
        const response = await dbConnect();
        expect(mongoose.connection.on)
    });
});


describe("Database connection", () => {
    it("should successfully disconnect to database", async () => {
        const response = await dbDisconnect();
        expect(!mongoose.connection.on)
    });
});