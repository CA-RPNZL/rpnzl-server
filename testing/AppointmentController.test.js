//  Import Supertest
const supertest = require("supertest");

// Import Mongoose
const mongoose = require("mongoose");

// Import jsonwebtoken
const jwt = require("jsonwebtoken");

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
  await Appointment.deleteOne({ startDateTime: new Date("11/11/2024 11:00 am") })
  console.log("Test appointment on 11/11/2024 deleted.");
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

    // Get data for service: "Cut & colour" from database
    const cutAndColourData = await Service.findOne({ name: "Cut & colour" }).exec();

    // Get one appointment that is booked for service: "Cut & colour" from database
    const testAppointment = await Appointment.findOne({ service: cutAndColourData._id }).exec();

    // GET /appointments/id/testAppointment._id
    const response = await supertest(app)
    .get("/appointments/id/" + testAppointment._id)
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("client");
    expect(response.body).toHaveProperty("hairstylist");
    expect(response.body).toHaveProperty("startDateTime");
    expect(response.body).toHaveProperty("endDateTime");
    expect(response.body).toHaveProperty("service");
    expect(response.body).toHaveProperty("duration");
  });

  it("should return an error if an incorrect appointment id is provided.", async () => {  
    // Generate a JWT - isAdmin = true
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
        "testUserId",
        true,
        false
    );

    const fakeAppointmentId = "fakeId";
    
    // GET /appointments/id/fakeAppointmentId._id
    const response = await supertest(app)
    .get("/appointments/id/" + fakeAppointmentId._id)
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(500);
  });

  
  it("should return an error due to an invalid JWT", async () => {
    // Generate an invalid JWT using a different secret key
    const testSuppliedToken = await jwt.sign({
      user_id: "testUserId",
      is_admin: false,
      is_hairstylist: false
    },
    "testSecretKey",
    { expiresIn: "7d" }
    );

    // Get data for service: "Cut & colour" from database
    const cutAndColourData = await Service.findOne({ name: "Cut & colour" }).exec();

    // Get one appointment that is booked for service: "Cut & colour" from database
    const testAppointment = await Appointment.findOne({ service: cutAndColourData._id }).exec();

    // GET /appointments/id/testAppointment._id
    const response = await supertest(app)
    .get("/appointments/id/" + testAppointment._id)
    .set("authtoken", testSuppliedToken);

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorised - invalid token.");
  });
});

// GET all future appointments by hairstylist ID
// Uses middleware: validateJwt
describe("GET /appointments/hairstylist/:hairstylistId?pastAppt=true/false", () => {
  it("should return all future appointments based on a selected hairstylist.", async () => {
    // Generate a JWT - isAdmin = true
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
        "testUserId",
        true,
        false
    );
    
    // Get data for hairstylist: "Michelle Smith" from database
    const michelleData = await User.findOne({ firstName: "Michelle", lastName: "Smith" }).exec();
    
    // GET /appointments/hairstylist/michelleData._id?pastAppt=false
    const response = await supertest(app)
    .get("/appointments/hairstylist/" + michelleData._id + "?pastAppt=false")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("client");
    expect(response.body[0]).toHaveProperty("hairstylist");
    expect(response.body[0]).toHaveProperty("startDateTime");
    expect(response.body[0]).toHaveProperty("endDateTime");
    expect(response.body[0]).toHaveProperty("service");
    expect(response.body[0]).toHaveProperty("duration");
  });

  it("should return all appointments (past and future) based on a selected hairstylist.", async () => {
    // Generate a JWT - isAdmin = true
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
        "testUserId",
        true,
        false
    );
    
    // Get data for hairstylist: "Michelle Smith" from database
    const michelleData = await User.findOne({ firstName: "Michelle", lastName: "Smith" }).exec();
    
    // GET /appointments/hairstylist/michelleData._id?pastAppt=false
    const response = await supertest(app)
    .get("/appointments/hairstylist/" + michelleData._id + "?pastAppt=true")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("client");
    expect(response.body[0]).toHaveProperty("hairstylist");
    expect(response.body[0]).toHaveProperty("startDateTime");
    expect(response.body[0]).toHaveProperty("endDateTime");
    expect(response.body[0]).toHaveProperty("service");
    expect(response.body[0]).toHaveProperty("duration");
  });
});

// GET appointments by hairstylist ID and only show limited information
// Used for blocking out dates and time
describe("GET /appointments/hairstylistdate/:hairstylistId", () => {
  it("should return all appointments based on a selected hairstylist with limited information.", async () => {  
    // Get data for hairstylist: "Rachel Green" from database
    const rachelData = await User.findOne({ firstName: "Rachel", lastName: "Green" }).exec();
    
    // GET /appointments/hairstylistdate/rachelData._id?pastAppt=false
    const response = await supertest(app)
    .get("/appointments/hairstylistdate/" + rachelData._id);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("startDateTime");
    expect(response.body[0]).toHaveProperty("endDateTime");
    expect(response.body[0]).not.toHaveProperty("client");
    expect(response.body[0]).not.toHaveProperty("hairstylist");
    expect(response.body[0]).not.toHaveProperty("service");
    expect(response.body[0]).not.toHaveProperty("duration");
  });

  it("should return an error if an incorrect hairstylist id is provided.", async () => {  
    const hairstylistId = "fakeId";
    
    // GET /appointments/hairstylistdate/hairstylistId
    const response = await supertest(app)
    .get("/appointments/hairstylistdate/" + hairstylistId);

    expect(response.statusCode).toBe(500);
  });
});

// GET all future appointments by client ID
// Uses middleware: validateJwt
describe("GET /appointments/user/:userId?pastAppt=true/false", () => {
  // Generate a JWT - isAdmin = true
  // generateJwt(userId, isAdmin, isHairstylist)
  const testJwt = authentication.generateJwt(
      "testUserId",
      true,
      false
  );

  it("should return all future appointments based on a selected client.", async () => {
    
    // Get data for client: "Bianca Lopez" from database
    const biancaData = await User.findOne({ firstName: "Bianca", lastName: "Lopez" }).exec();
    
    // GET /appointments/user/biancaData._id?pastAppt=false
    const response = await supertest(app)
    .get("/appointments/user/" + biancaData._id + "?pastAppt=false")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("client");
    expect(response.body[0]).toHaveProperty("hairstylist");
    expect(response.body[0]).toHaveProperty("startDateTime");
    expect(response.body[0]).toHaveProperty("endDateTime");
    expect(response.body[0]).toHaveProperty("service");
    expect(response.body[0]).toHaveProperty("duration");
  });

  it("should return an error if an incorrect client id is provided.", async () => {  
    const clientId = "fakeId";
    
    // GET /appointments/user/clientId._id?pastAppt=false
    const response = await supertest(app)
    .get("/appointments/user/" + clientId + "?pastAppt=false")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(500);
  });

  it("should return all appointments (past and future) based on a selected client.", async () => {
    
    // Get data for client: "Bianca Lopez" from database
    const biancaData = await User.findOne({ firstName: "Bianca", lastName: "Lopez" }).exec();
    
    // GET /appointments/user/biancaData._id?pastAppt=true
    const response = await supertest(app)
    .get("/appointments/user/" + biancaData._id + "?pastAppt=true")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("client");
    expect(response.body[0]).toHaveProperty("hairstylist");
    expect(response.body[0]).toHaveProperty("startDateTime");
    expect(response.body[0]).toHaveProperty("endDateTime");
    expect(response.body[0]).toHaveProperty("service");
    expect(response.body[0]).toHaveProperty("duration");
  });
});

// POST an appointments - create an appointment
// Uses middleware: validateJwt
describe("POST /appointments", () => {
  
  it("should create an appointment with the provided details", async () => {
    
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
    
    // Generate a JWT - isAdmin = false
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
      mockClient._id,
      false,
      false
    );
    
    const newAppointment = {
          _id: mockApptId,
          client: mockClient,
          hairstylist: mockHairstylist,
          startDateTime: mockStartDateTime,
          endDateTime: mockEndDateTime,
          service: mockService,
          duration: 60
    };

    // POST /appointments
    const response = await supertest(app)
    .post("/appointments")
    .send(newAppointment)
    .set("Content-Type", "application/json")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("client");
    expect(response.body).toHaveProperty("hairstylist");
    expect(response.body).toHaveProperty("startDateTime");
    expect(response.body).toHaveProperty("endDateTime");
    expect(response.body).toHaveProperty("service");
    expect(response.body).toHaveProperty("duration");
    
  });

  
  it("should return an error when an appointment cannot be created", async () => {
    const newAppointment = {
      duration: 60
    };
    
    // Generate a JWT - isAdmin = false
    // generateJwt(userId, isAdmin, isHairstylist)
    const testJwt = authentication.generateJwt(
      "testClientId",
      false,
      false
    );

    // POST /appointments
    const response = await supertest(app)
    .post("/appointments")
    .send(newAppointment)
    .set("Content-Type", "application/json")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(500);
  });
});

// PATCH an appointment - update an appointment
// Uses middleware: validateJwt
describe("PATCH /appointments/id/:id", () => {
  // Generate a JWT - isAdmin = false
  // generateJwt(userId, isAdmin, isHairstylist)
  const testJwt = authentication.generateJwt(
    "testUserId",
    true,
    false
  );

  it("should update an appointment with the provided details", async () => {
    // Create mock data
    const mockApptId = new mongoose.Types.ObjectId().toString();
    const mockStartDateTime = new Date("21/01/2024 11:00 am");
    const mockEndDateTime = new Date("21/01/2024 12:00 pm");
    const mockUpdatedAppt = {
      startDateTime: mockStartDateTime,
      endDateTime: mockEndDateTime
    };
    

    // PATCH /appointments/id/mockApptId
    const response = await supertest(app)
    .patch("/appointments/id/" + mockApptId)
    .send(mockUpdatedAppt)
    .set("Content-Type", "application/json")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Appointment updated successfully.");

  });

  it("should return an error when it cannot update an appointment that doesn't exist", async () => {
    const fakeAppointmentId = null;
    const mockStartDateTime = "21/01/2024 11:00 am";
    const mockEndDateTime = "21/01/2024 12:00 pm";
    const mockUpdatedAppt = {
      startDateTime: mockStartDateTime,
      endDateTime: mockEndDateTime
    };

    // PATCH /appointments/id/fakeAppointmentId
    const response = await supertest(app)
    .patch("/appointments/id/" + fakeAppointmentId)
    .send(mockUpdatedAppt)
    .set("Content-Type", "application/json")
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(500);
  });
});

// DELETE an appointment
// Uses middleware: validateJwt
describe("DELETE appointments/id/:id", () => {
  // Generate a JWT - isAdmin = false
  // generateJwt(userId, isAdmin, isHairstylist)
  const testJwt = authentication.generateJwt(
    "testUserId",
    true,
    false
  );

  it("should delete the appointment with id of :id", async () => {
    // Create mock data
    const mockApptId = new mongoose.Types.ObjectId().toString();
    const mockStartDateTime = new Date("21/01/2024 11:00 am");
    const mockEndDateTime = new Date("21/01/2024 12:00 pm");
    const mockUpdatedAppt = {
      startDateTime: mockStartDateTime,
      endDateTime: mockEndDateTime
    };

    // DELETE /appointments/id/mockApptId
    const response = await supertest(app)
    .delete("/appointments/id/" + mockApptId)
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Appointment deleted successfully.");
  });

  it("should return an error when it cannot delete an appointment that doesn't exist", async () => {
    const fakeAppointmentId = "fakeId";

    // DELETE /appointments/id/fakeAppointmentId
    const response = await supertest(app)
    .delete("/appointments/id/" + fakeAppointmentId)
    .set("authtoken", testJwt);

    expect(response.statusCode).toBe(500);
  });

});