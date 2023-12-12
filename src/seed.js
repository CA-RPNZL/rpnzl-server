// Import and configure dotenv
require("dotenv").config();

// Import Mongoose
const mongoose = require("mongoose");

const { dbConnect } = require("./database");
const { Service } = require("./models/ServiceModel");
const { User } = require("./models/UserModel");
const { Appointment } = require("./models/AppointmentModel");


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
        description: "Free consultation with each appointment. We will discuss final prices and approximate length of appointment. Provide full information on what will be completed throughout the appointment.",
        duration: "15"
    });

    // Create and save salon service
    await Service.create([cut, perm, colour, cutAndColour, consultation]).catch(error => {
        console.log("An error occurred when seeding the salon services:\n" + error)
    });

    console.log("Finished seeding services");

    // Users
    
    let newAdmin = new User({
        firstName: "George",
        lastName: "Sheridan",
        mobileNumber: "0411222333",
        email: "admin@mail.com",
        password: "adminpassword",
        is_admin: true,
    });
    
    let newHairstylist1 = new User({
        firstName: "Michelle",
        lastName: "Smith",
        mobileNumber: "0433444555",
        email: "michelle@mail.com",
        password: "hairstylistpassword1",
        is_hairstylist: true,
        // Uses ID value of services e.g. [cutServiceId, consultationServiceId]
        services: [cut._id.toString(), consultation._id.toString()]
    });
    
    let newHairstylist2 = new User({
        firstName: "Rachel",
        lastName: "Green",
        mobileNumber: "0421645978",
        email: "rachel@mail.com",
        password: "hairstylistpassword2",
        is_hairstylist: true,
        // Uses ID value of services e.g. [cutServiceId, consultationServiceId]
        services: [cut._id.toString(), colour._id.toString(), cutAndColour._id.toString(), consultation._id.toString()],
    });
    
    let newHairstylist3 = new User({
        firstName: "Angela",
        lastName: "Anaconda",
        mobileNumber: "0412345678",
        email: "angela@mail.com",
        password: "hairstylistpassword3",
        is_hairstylist: true,
        // Uses ID value of services e.g. [cutServiceId, consultationServiceId]
        services: [cut._id.toString(), perm._id.toString(), consultation._id.toString()]
    });
    
    let newUser = new User({
        firstName: "Bianca",
        lastName: "Lopez",
        mobileNumber: "0477444556",
        email: "bianca@mail.com",
        password: "clientpassword",
    });
    
    // Create and save users
    await User.create([newAdmin, newHairstylist1, newHairstylist2, newHairstylist3, newUser]).catch(error => {
        console.log("An error occurred when seeding the users:\n" + error)
    });

    console.log("Finished seeding users");
    
    
    
    // Appointments

    let appointmentConsultation = new Appointment({
        client: newUser._id,
        startDateTime: new Date("2023-12-15 14:00"),
        endDateTime: new Date("2023-12-15 14:15"),
        hairstylist: newHairstylist1._id,
        service: consultation._id,
        duration: consultation.duration,
    });

    let appointmentConsultation2 = new Appointment({
        client: newUser._id,
        startDateTime: new Date("2023-12-12 10:00"),
        endDateTime: new Date("2023-12-12 10:15"),
        hairstylist: newHairstylist2._id,
        service: consultation._id,
        duration: consultation.duration,
    });

    let appointmentCutAndColour = new Appointment({
        client: newUser._id,
        startDateTime: new Date("2023-12-17 12:00"),
        endDateTime: new Date("2023-12-17 14:30"),
        hairstylist: newHairstylist1._id,
        service: cutAndColour._id,
        duration: cutAndColour.duration,
    });

    // Create and save the appointment
    await Appointment.create([appointmentConsultation, appointmentConsultation2, appointmentCutAndColour]).catch(error => {
        console.log("An error occurred when seeding the appointments:\n" + error)
    });

    console.log("Finished seeding appointments");

    
    
})
.catch((error) => console.log("An error occurred:\n" + error));