//  Import Supertest
const supertest = require("supertest");

// Import Mongoose
const mongoose = require("mongoose");

// Import app
var {app} = require("../src/server.js");

// Import database
const { dbConnect, dbDisconnect } = require("../src/database.js");

// Import authentication.js
const authentication = require("../src/functions/authentication.js");

// Import User model
const { User } = require("../src/models/UserModel.js");
const { Service } = require("../src/models/ServiceModel.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await User.deleteOne({ firstName: "Marty", lastName: "McFly" }).exec();
    console.log("Test user Marty McFly deleted.");
    await dbDisconnect();
});


// GET all users
describe("GET /users", () => {
    it("should return all users", async () => {
        // Generate a JWT - isAdmin = true
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            "testUserId",
            true,
            false
        );

        const newUser = {
            firstName: "Marty",
            lastName: "McFly",
            mobileNumber: "0499123123",
            email: "marty@mail.com",
            password: "Password123!",
            is_admin: false,
            is_hairstylist: false
        };

        // GET /users
        const response = await supertest(app)
        .get("/users")
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);
        console.log("Test user Marty McFly created.");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});


// GET user by user ID
// Uses middleware: validateJwt, authAsAdminOrUser
describe("GET /users/id/:id", () => {
    it("should return user with id of :id", async () => {
        // Generate a JWT - isAdmin = true
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            "testUserId",
            true,
            false
        );

        // Mock a user result
        jest.spyOn(User, "findById").mockResolvedValue({
            _id: "mockUserId",
            firstName: "Marty",
            lastName: "McFly"
        });

        // GET /users/id/mockUserId
        const response = await supertest(app)
        .get("/users/id/mockSmockUserIderviceId")
        .set("authtoken", testJwt);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("firstName");
        expect(response.body.firstName).toBe("Marty");
        expect(response.body).toHaveProperty("lastName");
        expect(response.body.lastName).toBe("McFly");
    });
});


// GET all hairstylists by a specific service ID
describe("GET /users/hairstylists?service=:id", () => {
    it("should return all hairstylists, but only show limited information", async () => {
        const consultationService = await Service.findOne({name: "Consultation"}).exec();

        // GET /users/hairstylists?service=consultationId
        const response = await supertest(app)
        .get("/users/hairstylists?service=" + consultationService._id);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("firstName");
        expect(response.body[0]).toHaveProperty("lastName");
        expect(response.body[0]).toHaveProperty("services");
    });
});


// POST a new user - user sign up
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

        // POST /users
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


// PATCH a user - update user details
// Uses middleware: validateJwt, authAsAdminOrUser
describe("PATCH /users/id/:id", () => {
    it("should update the user's details with id of :id with the provided details", async () => {
        // Mock a user result
        // Create a mongoose _id
        const mockUserId = new mongoose.Types.ObjectId().toString();

        jest.spyOn(User, "findById").mockResolvedValue({
            _id: mockUserId,
            firstName: "Marty",
            lastName: "McFly",
            mobileNumber: "0400 123 123",
            email: "marty@email.com",
            password: "Password1!",
            is_admin: false,
            is_hairstylist: false
        });
        
        // Generate a JWT - user ID = mockUserId
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            mockUserId,
            false,
            false
        );

        const mockUpdatedUser = {
            mobileNumber: "0411 123 123"
        };

        // PATCH /users/id/mockUserId
        const response = await supertest(app)
        .patch("/users/id/" + mockUserId)
        .send(mockUpdatedUser)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User account updated successfully.");
    });
});


// DELETE a user
// Uses middleware: validateJwt, authAsAdminOrUser
describe("DELETE /users/id/:id", () => {
    it("should delete the user with id of :id", async () => {
        // Mock a user result
        // Create a mongoose _id
        const mockUserId = new mongoose.Types.ObjectId().toString();

        jest.spyOn(User, "findById").mockResolvedValue({
            _id: mockUserId,
            firstName: "Marty",
            lastName: "McFly",
            mobileNumber: "0400 123 123",
            email: "marty@email.com",
            password: "Password1!",
            is_admin: false,
            is_hairstylist: false
        });
        
        // Generate a JWT - user ID = mockUserId
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            mockUserId,
            false,
            false
        );

        // DELETE /users/id/mockUserId
        const response = await supertest(app)
        .delete("/users/id/" + mockUserId)
        .set("authtoken", testJwt);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User account and future appointments deleted successfully.");
    });

    
    it("should not delete the user with id of :id if the user isn't the admin or targeted user", async () => {
        // Mock a user result
        // Create a mongoose _id
        const mockUserId = new mongoose.Types.ObjectId().toString();
        const mockNotUserId = new mongoose.Types.ObjectId().toString();

        jest.spyOn(User, "findById").mockResolvedValue({
            _id: mockUserId,
            firstName: "Marty",
            lastName: "McFly",
            mobileNumber: "0400 123 123",
            email: "marty@email.com",
            password: "Password1!",
            is_admin: false,
            is_hairstylist: false
        });
        
        // Generate a JWT - user ID = mockUserId
        // generateJwt(userId, isAdmin, isHairstylist)
        const testJwt = authentication.generateJwt(
            mockNotUserId,
            false,
            false
        );

        // DELETE /users/id/mockUserId
        const response = await supertest(app)
        .delete("/users/id/" + mockUserId)
        .set("authtoken", testJwt);

        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe("You do not have authorisation to proceed.");
    });
});