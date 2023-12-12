// Import and configure dotenv
require("dotenv").config();

// Import Mongoose
const mongoose = require("mongoose");

const { dbConnect } = require("./database");

dbConnect().then(async ()=> {
    if (process.env.WIPE == "true") {
        console.log("Wiping database...");
        await mongoose.connection.db.dropDatabase();
        console.log("Database has been wiped!");
    }
}).then(() => {
    mongoose.connection.close();
    console.log("Database connection closed.");
}).catch((error) => console.log("An error occurred:\n" + error));