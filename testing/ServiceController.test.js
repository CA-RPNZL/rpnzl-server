// //  Import Supertest
const request = require("supertest");

// // Import app
var {app} = require("../src/server.js")

// // Import database
var {dbConnect, dbDisconnect} = require("../src/database.js");
const { generateJwt } = require("../src/functions/authentication.js");

// Connect to the database before each test
beforeEach(async () => {
    await dbConnect();
});

// Disconnect from the database after each test
afterEach(async () => {
    await dbDisconnect();
});

// Create variable to store test service
let serviceId = "";

describe("GET /services", () => {
    it("should return all services", async () => {
        const response = await request(app).get("/services");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe("POST /services", () => {
    it("should create a new service", async ()=> {
        const mockJwt = jest.fn(() => generateJwt)
        const response = await request(app)
        .post("/services")
        .set("content-type", "application/json")
        .set("authtoken", mockJwt)
        .send({
            name: "Test service",
            price: "$200",
            description: "This is a test service. Cannot guarantee a good haircut.",
            duration: "60"
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("service")
    })
})

// describe("GET /services/id/:id", () => {
//     it("should return service by service id", async ()=> {
//         const response = await request(app).get("/services/")
//     })
// })