// Import Mongoose
const mongoose = require("mongoose");
const { dbConnect } = require("./database");
const { Service } = require("./models/ServiceModel");


// Import and configure dotenv
require("dotenv").config();


// Connect to the database
dbConnect().then(async ()=> {
    console.log("Creating seed data");

    // Salon services

    let cut = new Service({
        name: "Cut",
        price: "$40+",
        description: "Includes: Hair wash, blow dry and cut. Prices and time will vary due to thickness and length of hair.",
        duration: "30"
    });

    let perm = new Service({
        name: "Perm",
        price: "$250 - $500",
        description: "Includes: Perm, wash and styling. Prices and time will vary due to thickness and length of hair.",
        duration: "120"
    });

    let colour = new Service({
        name: "Colour",
        price: "$270+",
        description: "Includes: Colouring, hair wash and styling. Prices and time will vary due to thickness and length of hair.",
        duration: "120"
    });

    let cutAndColour = new Service({
        name: "Cut & colour",
        price: "$280 - $530",
        description: "Includes: Hair wash, colour, cut and styling. Prices and time will vary due to thickness and length of hair.",
        duration: "150"
    });

    let consultation = new Service({
        name: "Consultation",
        price: "Free!",
        description: "Free consultation with each appointment. We will discuss final prices and approximate length of appointment.\\nProvide full information on what will be completed throughout the appointment.",
        duration: "15"
    });

    // Create and save salon service
    await Service.create([cut, perm, colour, cutAndColour, consultation]).catch(error => {
        console.log("An error occurred:\n" + error)
    });


});