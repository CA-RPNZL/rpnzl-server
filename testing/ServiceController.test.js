//  Import Supertest
const supertest = require("supertest");

// Import app
var {app} = require("../src/server.js")

// Import database
var {dbConnect, dbDisconnect} = require("../src/database.js");
// const validateJwt = require("../src/functions/authentication.js");
const authentication = require("../src/functions/authentication.js");
const authAsAdmin = require("../src/functions/authorisation.js");
const { Service } = require("../src/models/ServiceModel.js");

// jest.mock("../src/functions/authentication.js");


// Connect to the database before all tests
beforeAll(async () => {
    await dbConnect();
    jest.resetModules();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await dbDisconnect();
});


// GET all services
describe("GET /services", () => {
    it("should return all services", async () => {
        // GET /services
        const response = await supertest(app).get("/services");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0); // array contains at least one service
    });
});

// POST /services
describe("POST /services", () => {
    it("should create a new service", async ()=> {
        const testJwt = authentication.generateJwt({
            user_id: "testUserId",
            is_Admin: true,
            is_hairstylist: false
        });

        console.log("testJwt: " + testJwt);

        const request = {
            headers: {
                authtoken: testJwt
            }
        }
        const validateTestJwt = authentication.validateJwt(request, response, next);

        // const needUser = await supertest(app)
        // .post("/users/login")
        // .send({
        //     email: "test@mail.com",
        //     passworD: "Password1!"
        // });

        // const testJwt = await needUser.body.jwt;

        // Mock validateJwt
        // const validateJwt = jest.fn();
        // console.log(validateJwt());
        // validateJwt.mockImplementation((request, response, next) => {
        //     request.user = { userId: "mockUserId"};
        //     next();
        // });
        
        // jest.spyOn(authentication, "validateJwt").mockResolvedValue((request, response, next) => {
        //     request.user = { userId: "mockUserId"};
        //     next();
        // });


        

        // Mock authAsAdmin
        const authAsAdmin = jest.fn();
        console.log(authAsAdmin());


        const newService = {
            name: "Test service",
            price: "$200",
            description: "We cannot guarantee a good haircut.",
            duration: 60
        };

        console.log("I can see the newService data!");

        const response = await supertest(app)
        .post("/services")
        .send(newService)
        .set("Content-Type", "application/json");
        // .set("authtoken", "mockAuthToken");

        console.log(response.body);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("name");
    });
});

// GET service by service ID
describe("GET /services/id/:id", () => {
    it("should return service with id of :id", async () => {
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
describe("PATCH /services/id/:id", () => {
    it("should update the service with id of :id", async () => {
        const updatedService = {
            name: "Keratin treatment"
        };

        const response = await supertest(app)
        .patch("/services/id/mockServiceId")
        .send(updatedService)
        .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("name");
        expect(response.body.name).toBe("Keratin treatment");
    })
});

// // DELETE /services/id/:id
// describe("DELETE /services/id/:id", () => {
//     it("should delete the service with id of :id", async () => {})
// });