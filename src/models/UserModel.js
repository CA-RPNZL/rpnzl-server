const mongoose = require('mongoose')

const Schema = mongoose.Schema;

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
        type: Number,
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
    }

});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}