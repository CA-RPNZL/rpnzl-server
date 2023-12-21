// //  Import Supertest
const request = require("supertest");

// // Import app
var {app} = require("../src/server.js")

// // Import database
var {dbConnect, dbDisconnect} = require("../src/database.js");

// Connect to the database before each test
beforeEach(async () => {
    await dbConnect();
});

// Disconnect from the database after each test
afterEach(async () => {
    await dbDisconnect();
});

describe("GET /services", () => {
    it("should return all services", async () => {
        const res = await request(app).get("/services");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("POST /services", () => {
    it("should create a new service", async ()=> {
        
    })
})

describe("GET /services/id/:id", () => {
    it("should return service by service id", async ()=> {
        const res = await request(app).get("/services/")
    })
})