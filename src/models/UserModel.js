const mongoose = require("mongoose")

const Schema = mongoose.Schema;

// Create User Schema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false,
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    is_hairstylist: {
        type: Boolean,
        default: false
    },
      // Additional fields for hairstylists
    bio: {
        type: String
    },
    services: [
        {
            // references the Service Model
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
        },
    ],
});


// Create User Model
const User = mongoose.model("User", UserSchema);

// Export User Model
module.exports = {
    User
}