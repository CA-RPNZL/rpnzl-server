const supertest = require("supertest");

// Import Mongoose
const mongoose = require("mongoose");

// Import bcrypt
const bcrypt = require("bcryptjs/dist/bcrypt");

// Import app
var {app} = require("../src/server.js");

// Import database
const { dbConnect, dbDisconnect } = require("../src/database.js");

// Import authentication.js
const authentication = require("../src/functions/authentication.js");

// Import User model
const { User } = require("../src/models/UserModel.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await dbDisconnect();
});



describe("POST /login", () => {
    it("should allow an existing user to log in with their details", async () => {
        const testLoginDetails = {
            email: "bianca@mail.com",
            password: "clientpassword"
        };

        const response = await supertest(app)
        .post("/login")
        .send(testLoginDetails)
        .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200);
    });


    it("should return an error if user doesn't exist", async () => {
        const testLoginDetails = {
            email: "newuser@mail.com",
            password: "Password1!"
        };

        const response = await supertest(app)
        .post("/login")
        .send(testLoginDetails)
        .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("User does not exist.");
    });

    it("should not allow a user to log in with an incorrect password", async () => {
        const testLoginDetails = {
            email: "bianca@mail.com",
            password: "Password1!"
        };

        const response = await supertest(app)
        .post("/login")
        .send(testLoginDetails)
        .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Wrong password, please try again.");
    });

});

// PATCH a user - update user password
// Uses middleware: validateJwt, authAsUser
describe("PATCH /changepassword/:id", () => {        
        
    it("should update a user's password with the new password", async () => {
        
    // Mock a user result
    // Create a mongoose _id
    const mockUserId = new mongoose.Types.ObjectId().toString();
    let mockPassword = "Password1!"
    let passwordSalt = await bcrypt.genSalt(10);
    const mockHashedPassword = await bcrypt.hash(mockPassword, passwordSalt);
    
    jest.spyOn(User, "findById").mockResolvedValue({
        _id: mockUserId,
        firstName: "Marty",
        lastName: "McFly",
        mobileNumber: "0400 123 123",
        email: "marty@email.com",
        password: mockHashedPassword,
        is_admin: false,
        is_hairstylist: false,
        save: jest.fn() // mock save function
    });
    // Generate a JWT - user ID = mockUserId
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
        mockUserId,
        false,
        false
    );

        const updatedPassword = {
            oldPassword: "Password1!",
            newPassword: "Welcome1!"
        };

        const response = await supertest(app)
        .patch("/changepassword/" + mockUserId)
        .send(updatedPassword)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        console.log(response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Successfully changed password");
    });

    it("should return an error if no password is supplied", async () => {
        
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
        const updatedPassword = {
            oldPassword: "",
            newPassword: ""
        };

        const response = await supertest(app)
        .patch("/changepassword/" + mockUserId)
        .send(updatedPassword)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid request");
    });

    it("should return an error if current password is incorrect", async () => {
        
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
        const updatedPassword = {
            oldPassword: "Password3!",
            newPassword: "Password2!"
        };

        const response = await supertest(app)
        .patch("/changepassword/" + mockUserId)
        .send(updatedPassword)
        .set("Content-Type", "application/json")
        .set("authtoken", testJwt);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid current password");
    });
});