// Import and configure dotenv
require("dotenv").config();

// Import bcrypt
const bcrypt = require("bcryptjs");

// Import jsonwebtoken
const jwt = require("jsonwebtoken");


// Check if passwords match
async function comparePassword(reqPassword, userPassword) {
    let isPasswordCorrect = false;

    // bcrypt.compare(myPlaintextPassword, hashedPassword)
    isPasswordCorrect = await bcrypt.compare(reqPassword, userPassword);

    return isPasswordCorrect;
};


// Generate JWT
function generateJwt(userId, isAdmin, isHairstylist) {
    // jwt.sign(payload, secretOrPrivateKey, options)
    return authtoken = jwt.sign(
        { 
            user_id: userId,
            is_admin: isAdmin,
            is_hairstylist: isHairstylist
         },
        process.env.JWT_SECRETKEY,
        { expiresIn: "7d" }
    );
};


// Validate JWT
function validateJwt(request, response, next) {
    try {
        // Grab the JWT from the header
        let suppliedToken = request.headers.authtoken;
    
        // Handle if no token found
        if (!suppliedToken) {
            return response.status(401).json({
                error: "Unauthorised - missing token."
            });
        };
        
        // Verify if the JWT is valid
        // jwt.verify(token, secretorPublicKey, options)
        const decodedToken = jwt.verify(suppliedToken, process.env.JWT_SECRETKEY);
    
        // Set the decoded token as the request.user
        request.user = decodedToken;
    
        // Continue to next middleware
        // console.log("User has been validated.");
        next();
    } catch (error) {
        // Handle error if issue with token
        console.log("suppliedToken is: " + suppliedToken);
        console.log("decodedToken is: " + decodedToken);
        console.log("User has not been validated.");
        return response.status(401).json({
            error: "Unauthorised - invalid token."
        });
    };
};


module.exports = {
    comparePassword,
    generateJwt,
    validateJwt
};