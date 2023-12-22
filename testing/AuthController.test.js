const supertest = require("supertest");

// Import app
var {app} = require("../src/server.js");

// Import database
const { dbConnect, dbDisconnect } = require("../src/database.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await dbDisconnect();
});


// Error: Exceeded timeout of 5000 ms for a test.
describe("POST /login", () => {
    it("should attempt to log a user in with the provided details", async () => {
        const testLoginDetails = {
            email: "bianca@mail.com",
            password: "clientpassword"
        };

        const response = await supertest(app)
        .post("/login")
        .send(testLoginDetails)
        .set("Content-Type", "application/json");
        console.log(response.body);

        expect(response.statusCode).toBe(200);
        // Add more expects
    })
})