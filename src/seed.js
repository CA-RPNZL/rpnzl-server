// Import Mongoose
const mongoose = require("mongoose");
const { dbConnect } = require("./database");
const { Services } = require("./models/ServicesModel");


// Import and configure dotenv
require("dotenv").config();


// Connect to the database
dbConnect().then(async ()=> {
    console.log("Creating seed data");

    // Salon services

    let cut = new Services({
        name: "Cut",
        price: "$40+",
        description: "Includes: Hair wash, blow dry and cut. Prices and time will vary due to thickness and length of hair.",
        duration: "30"
    });
    await cut.save();

    let perm = new Services({
        name: "Perm",
        price: "$250 - $500",
        description: "Includes: Perm, wash and styling. Prices and time will vary due to thickness and length of hair.",
        duration: "120"
    });
    await perm.save();

    let colour = new Services({
        name: "Colour",
        price: "$270+",
        description: "Includes: Colouring, hair wash and styling. Prices and time will vary due to thickness and length of hair.",
        duration: "120"
    });
    await colour.save();

    let cutAndColour = new Services({
        name: "Cut & colour",
        price: "$280 - $530",
        description: "Includes: Hair wash, colour, cut and styling. Prices and time will vary due to thickness and length of hair.",
        duration: "150"
    });
    await cutAndColour.save();

    let consultation = new Services({
        name: "Consultation",
        price: "Free!",
        description: "Free consultation with each appointment. We will discuss final prices and approximate length of appointment.\\nProvide full information on what will be completed throughout the appointment.",
        duration: "15"
    });
    await consultation.save();


});