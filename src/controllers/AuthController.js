// Import Express JS
const express = require("express");

// Import Mongoose
const mongoose = require("mongoose");

// Create an instance of an Express Router
const router = express.Router();

// Import bcrypt
const bcrypt = require("bcryptjs/dist/bcrypt");

// Import User model
const { User } = require("../models/UserModel");

// Import middleware
const { comparePassword, generateJwt, validateJwt } = require("../functions/authentication");


// POST /login
// request.body = { email: "admin@rpnzl.com.au", password: "Password1!" }
router.post("/login", async (request, response) => {
    try {
        // Find user via email
        let userEmail = request.body.email.trim().toLowerCase();
        let user = await User.findOne({email: userEmail});

        // If user doesn't exist, throw error
        if (!user) {
            return response.status(400).json({
                error: "User does not exist."
            });
        };

        // If user exists, check if password is correct
        let isPasswordCorrect = await comparePassword(request.body.password, user.password);
        
        // If password is incorrect, throw error
        if (!isPasswordCorrect) {
            return response.status(401).json({
                error: "Wrong password, please try again."
            });
        };

        // Determine if the user is an admin
        const isAdmin = user.is_admin;

        // Determine if the user is a hairstylist
        const isHairstylist = user.is_hairstylist;

        // If password is correct, generate a JWT
        let userJwt = generateJwt(user._id.toString(), isAdmin, isHairstylist);
        
        // Respond with JWT
        response.json({
            jwt: userJwt,
            userId: user._id.toString(),
            isAdmin: isAdmin,
            isHairstylist: isHairstylist
        });

    } catch (error) {
        console.log(error);
        return response.status(500).json({
            error: error
        });
    };

});


// Change password
// Need user auth for own id
// PATCH /changepassword/:userId
router.patch("/changepassword/:userId", validateJwt, async (request, response) => {
    try {
        const { oldPassword, newPassword } = request.body;
        // if either or both null, return with error
        if (!(oldPassword && newPassword)) {
            return response.status(400).json({message: "Invalid request"})
        }

        const user = await User.findById(request.params.userId);
        console.log("user is: ");
        console.log(user);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const correctPassword = await comparePassword(oldPassword, user.password);
        if (!correctPassword) {
            return response.status(401).json({message: "Invalid current password"})
        }

        user.password = newPassword;
        await user.save();

        return response.status(200).json({message: "Successfully changed password"})

    } catch (error) {
      response.status(500).json({ error: error.message });
    }
});


module.exports = router;