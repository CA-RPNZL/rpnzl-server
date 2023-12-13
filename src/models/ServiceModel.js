// Import Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Service schema
const ServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    duration: {
        type: Number,
        required: true,
        unique: false
    }
});


// Create the Service model
const Service = mongoose.model("Service", ServiceSchema);

module.exports = {
    Service
}