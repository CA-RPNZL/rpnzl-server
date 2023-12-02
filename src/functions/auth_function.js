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
    console.log(reqPassword);
    console.log(userPassword);
    console.log(isPasswordCorrect);
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
// function validateJwt = (request, response, next) => {
//     let suppliedToken = request.headers.jwtl;
//     // jwt.verify(token, secretorPublicKey, options)
//     jwt.verify(suppliedToken, process.env.JWT_SECRETKEY, )
// }


module.exports = {
    comparePassword,
    generateJwt
};