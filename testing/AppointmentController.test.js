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

// Import Service model
const { Service } = require("../src/models/ServiceModel.js");

// Import Appointment model
const { Appointment } = require("../src/models/AppointmentModel.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await dbDisconnect();
});


// GET all appointments
// Uses middleware: validateJwt, authAsAdmin
describe("GET /appointments", () => {
  it("should get all appointments", async () => {
    // Generate a JWT - isAdmin = true
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
        "testUserId",
        true,
        false
    );

    // GET /appointments
    const response = await supertest(app)
    .get("/appointments")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

// GET appointment by user ID
// Uses middleware: validateJwt
describe("GET /appointments/id/:apptId", () => {
  it("should return appointment with id of :id", async () => {
    // Generate a JWT - isAdmin = true
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
        "testUserId",
        true,
        false
    );

    // Mock an appointment
    // Create mock appt ID, client ID, hairstylist ID, service ID
    const mockApptId = new mongoose.Types.ObjectId().toString();
    const mockClient = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        firstName: "Fake",
        lastName: "Client",
        is_hairstylist: false,
        is_admin: false
    });
    const mockHairstylist = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        firstName: "Fake",
        lastName: "Hairstylist",
        is_hairstylist: true,
        services: "Good haircut"
    });
    const mockStartDateTime = new Date("11/11/2024 11:00 am");
    const mockEndDateTime = new Date("11/11/2024 12:00 pm");
    const mockService = new Service({
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Good haircut"
    });

    jest.spyOn(Appointment, "findById").mockResolvedValue({
        _id: mockApptId,
        client: mockClient._id,
        hairstylist: mockHairstylist._id,
        startDateTime: mockStartDateTime,
        endDateTime: mockEndDateTime,
        service: mockService._id,
        duration: 60
    });

    // GET /appointments
    const response = await supertest(app)
    .get("/appointments/id/" + mockApptId)
    .set("authtoken", testJwt);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty("client");
    expect(response.body).toHaveProperty("hairstylist");
    expect(response.body).toHaveProperty("startDateTime");
    expect(response.body).toHaveProperty("endDateTime");
    expect(response.body).toHaveProperty("service");
    expect(response.body).toHaveProperty("duration");
  });
});

// // GET all future appointments by hairstylist ID
// // Uses middleware: validateJwt
// describe("GET /appointments/hairstylist/:hairstylistId?pastAppt=false", () => {
//   it("should return all future appointments based on a selected hairstylist.", async () => {});
// });

// // GET appointments by hairstylist ID and only show limited information
// // Used for blocking out dates and time
// describe("GET /appointments//hairstylistdate/:hairstylistId", () => {
//   it("should return all appointments based on a selected hairstylist with limited information.", async () => {});
// });

// // GET all future appointments by client ID
// // Uses middleware: validateJwt
// describe("GET /appointments/user/:userId?pastAppt=false", () => {
//   it("should return all future appointments based on a selected client.", async () => {});
// });

// // POST an appointments - create an appointment
// // Uses middleware: validateJwt
// describe("POST /appointments", () => {
//   it("should create an appointment with the provided details", async () => {});
// });

// // PATCH an appointment - update an appointment
// // Uses middleware: validateJwt
// describe("PATCH /appointments/id/:id", () => {
//   it("should update an appointment with the provided details", async () => {});
// });

// // DELETE an appointment
// // Uses middleware: validateJwt
// describe("DELETE appointments/id/:id", () => {
//   it("should delete the appointment with id of :id", async () => {});
// });

















// describe("GET /hairstylistdate/:hairstylistId", () => {
//   it("should show appointments by hairstylist id but only start and end dates", async () => {
//     // Mock a hairstylist
//     const testHairstylist = jest.spyOn(User, "findById").mockResolvedValue({
//       firstName: "Marty",
//       lastName: "McFly",
//       mobileNumber: "0499123123",
//       email: "marty@mail.com",
//       password: "Password123!",
//       is_admin: false,
//       is_hairstylist: true
//     });
//     const response = await supertest(app).get("/appointments/hairstylistdate/");

//     expect(response.statusCode).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0); // array contains at least one service
//   });
// });
