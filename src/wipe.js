// Import and configure dotenv
require("dotenv").config();

// Import Mongoose
const mongoose = require("mongoose");

const { dbConnect } = require("./database");

dbConnect().then(async ()=> {
    if (process.env.WIPE == "true") {
        // Get list of collections form database
        const collections = await mongoose.connection.db.listCollections().toArray();
        // Get the name of each collection
        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            // Delete each collection
            mongoose.connection.db.dropCollection(collectionName);
            console.log(collectionName + " has been deleted.");
        });
    }
}).then(() => {
    mongoose.connection.close();
    console.log("Database connection closed.");
});