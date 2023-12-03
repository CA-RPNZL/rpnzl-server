// Import bcrypt
const bcrypt = require("bcryptjs");

// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// Import and configure dotenv
require("dotenv").config();


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
    return newJwt = jwt.sign(
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
        let suppliedToken = request.headers.jwt;
    
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
        next();
    } catch (error) {
        // Handle error if issue with token
        return response.status(401).json({
            error: "Unauthorised - invalid token."
        });
    };
};


// Authorise as admin
function authAsAdmin(request, response, next) {
    // Check if the user is admin
    if (request.user.is_admin) {
        // If user is admin, continue to next middleware
        next();
    } else {
        // Handle error if user is not admin
        return response.status(403).json({
            error: "You do not have authorisation to proceed."
        });
    };
};


module.exports = {
    comparePassword,
    generateJwt,
    validateJwt,
    authAsAdmin
};