// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
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
        unique: false}
});

// Create Services document
const Services = mongoose.model('Services', ServicesSchema);

module.exports = {
    Services
}