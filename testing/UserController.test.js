//  Import Supertest
const supertest = require("supertest");

// Import app
var {app} = require("../src/server.js");
const { dbConnect, dbDisconnect } = require("../src/database.js");
const authentication = require("../src/functions/authentication.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await dbDisconnect();
});


// router.get("/", validateJwt, authAsAdmin
// router.get("/id/:id", validateJwt, authAsAdminOrUser
// router.get("/hairstylists"
// router.post("/"
describe("POST /users", () => {
    it("should create a new user with the provided details", async () => {
        const newUser = {
            firstName: "Marty",
            lastName: "McFly",
            mobileNumber: "0499123123",
            email: "marty@mail.com",
            password: "Password123!",
            is_admin: false,
            is_hairstylist: false
        };
        
        const response = await supertest(app)
        .post("/users")
        .send(newUser)
        .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("firstName");
        expect(response.body).toHaveProperty("lastName");
        expect(response.body).toHaveProperty("mobileNumber");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("password");
    });
});


// router.patch("/id/:id", validateJwt, authAsAdminOrUser
// router.delete("/id/:id", validateJwt, authAsAdminOrUser