// Import Mongoose
const mongoose = require("mongoose");
const { dbConnect } = require("./database");
const { Services } = require("./models/ServicesModel");

dbConnect().then(async ()=> {
    console.log("Creating seed data");

    // Salon services

    let cut = new Services({
        name: "Cut",
        price: "$40+",
        description: "Includes: Hair wash, blow dry and cut\\nPrices and time will vary due to thickness and length of hair.",
        duration: "30"
    });

    let perm = new Services({
        name: "Perm",
        price: "$250 - $500",
        description: "Includes: Perm, wash and styling\\nPrices and time will vary due to thickness and length of hair.",
        duration: "120"
    });

    let colour = new Services({
        name: "Colour",
        price: "$270+",
        description: "Includes: Colouring, hair wash and styling\\nPrices and time will vary due to thickness and length of hair.",
        duration: "120"
    });

    let cutAndColour = new Services({
        name: "Cut & colour",
        price: "$280 - $530",
        description: "Includes: Hair wash, colour, cut and styling\\nPrices and time will vary due to thickness and length of hair.",
        duration: "150"
    });

    let consultation = new Services({
        name: "Consultation",
        price: "0",
        description: "Free consultation with each appointment.\\nWe will discuss final prices and approximate length of appointment.\\nProvide full information on what will be completed throughout the appointment.",
        duration: "15"
    });


});