//  Import Supertest
const supertest = require("supertest");

// Import Mongoose
const mongoose = require("mongoose");

// Import app
var {app} = require("../src/server.js")

// Import database
var {dbConnect, dbDisconnect} = require("../src/database.js");

// Import authentication.js
const authentication = require("../src/functions/authentication.js");

// Import Service model
const { Service } = require("../src/models/ServiceModel.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await Service.deleteOne({ name: "Bad haircut" });
    await dbDisconnect();
});


// GET all services
describe("GET /services", () => {
    it("should return all services.", async () => {
        // GET /services
        const response = await supertest(app).get("/services");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0); // array contains at least one service
    });
});

// POST /services
// Uses middleware: validateJwt, authAsAdmin
describe("POST /services", () => {
    it("should create a new service with the provided details.", async ()=> {
        // Generate a JWT - isAdin = true
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            "testUserId",
            true,
            false
        );

        const newService = {
            name: "Bad haircut",
            price: "$200",
            description: "We cannot guarantee a good haircut.",
            duration: 60
        };

        // POST /services
        const response = await supertest(app)
        .post("/services")
        .send(newService)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("name");
        expect(response.body.name).toBe(newService.name);
    });
});

// GET service by service ID
describe("GET /services/id/:id", () => {
    it("should return service with id of :id.", async () => {
        // Mock a service result
        jest.spyOn(Service, "findById").mockResolvedValue({
            _id: "mockServiceId",
            name: "mockServiceName",
            price: "$100",
            description: "We cannot guarantee a good haircut.",
            duration: 60
        });

        // GET /services/id/mockServiceId
        const response = await supertest(app).get("/services/id/mockServiceId");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("price");
        expect(response.body).toHaveProperty("description");
        expect(response.body).toHaveProperty("duration");
    });
});

// PATCH /services/id/:id
// Uses middleware: validateJwt, authAsAdmin
describe("PATCH /services/id/:id", () => {
    it("should update the service with id of :id with the provided details.", async () => {
        // Mock a service result
        // Create a mongoose _id
        const mockServiceId = new mongoose.Types.ObjectId().toString();

        jest.spyOn(Service, "findByIdAndUpdate").mockResolvedValue(
            {
                _id: mockServiceId,
                name: "mockServiceName",
                price: "$100",
                description: "We cannot guarantee a good haircut.",
                duration: 60,
            },
            { returnDocument: "after" }
        );

        // Generate a JWT - isAdin = true
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            "testUserId",
            true,
            false
        );

        console.log("testJwt: " + testJwt);

        const mockUpdatedService = {
            name: "Relaxing treatment",
            price: "$60"
        };
        console.log("I can see the updatedService data!");
        console.log("updatedService: " + mockUpdatedService);
        console.log("mockServiceId: " + mockServiceId);

        // PATCH /services/id/mockServiceId
        const response = await supertest(app)
        .patch(`/services/id/${mockServiceId}`)
        .send(mockUpdatedService)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        // Error: not showing updated value - used {return: after} in mongoose
        console.log(response.body);
        console.log("updatedService: " + response.body.updatedService.name);


        expect(response.statusCode).toBe(200);
        expect(response.body.updatedService).toHaveProperty("name");
        expect(response.body.updatedService.name).toBe(mockUpdatedService.name);
    })
});

// DELETE /services/id/:id
describe("DELETE /services/id/:id", () => {
    it("should delete the service with id of :id", async () => {
        // Generate a JWT - isAdin = true
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            "testUserId",
            true,
            false
        );

        // Mock a service result
        // Create a mongoose _id
        const mockServiceId = new mongoose.Types.ObjectId().toString();

        jest.spyOn(Service, "findByIdAndDelete").mockResolvedValue(
            {
                _id: mockServiceId
            }
        );


        // DELETE /services/id/mockServiceId
        const response = await supertest(app)
        .delete(`/services/id/${mockServiceId}`)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        expect(response.statusCode).toBe(200);
        // Add more expects
    });
});