// Import and configure dotenv
require("dotenv").config();

// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// Import validateJwt function
const { validateJwt, generateJwt } = require("../src/functions/authentication");

// Generate JWT
describe("generateJWT", () => {
    it("should return a JWT", async () => {
        const userId = "userId";
        const isAdmin = false;
        const isHairstylist = false;

        // Generate JWT
        const authtoken = await generateJwt(userId, isAdmin, isHairstylist);

        // Decode JWT
        const decodedToken = jwt.decode(authtoken);
        
        expect(decodedToken).toHaveProperty("user_id");
        expect(decodedToken).toHaveProperty("is_admin");
        expect(decodedToken).toHaveProperty("is_hairstylist");
        expect(decodedToken).toHaveProperty("iat");
        expect(decodedToken).toHaveProperty("exp");
    });
});