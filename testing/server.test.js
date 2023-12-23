// //  Import Supertest
const supertest = require("supertest");

// // Import app
var {app} = require("../src/server.js");

describe("GET /", () => {
    it("should return 'Hello world!'", async () => {
        const response = await supertest(app).get("/");
        expect(response.text).toBe("Hello world!");
    });
});

describe("GET /", () => {
    it("should return 'Hello world!'", async () => {
        const response = await supertest(app).get("/404");
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain("This path could not be found!");
    });
});