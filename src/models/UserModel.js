const mongoose = require("mongoose")

const Schema = mongoose.Schema;

// Import bcrypt
const bcrypt = require("bcryptjs");


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

// middleware to hash password before User is saved

UserSchema.pre("save", async function (next) {
    var user = this;

    // if password has not been updated / not new, skip step
    if (!user.isModified("password")) {
        return next();
    }

    // hash and salt if password is new / updated
    let passwordSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, passwordSalt);
    this.password = hash;
    next();
});


// Create User Model
const User = mongoose.model("User", UserSchema);


// Export User Model
module.exports = {
    User
}