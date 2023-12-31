// Import Mongoose
const mongoose = require("mongoose");


// Connect or create and connect to a database
async function dbConnect() {
    let dbUri = "";

    switch (process.env.NODE_ENV) {
        case "development":
            dbUri = "mongodb://localhost:27017/rpnzl";
            break;
        case "production":
            dbUri = process.env.DB_URI;
            break;
        default:
            dbUri = "mongodb://localhost:27017/rpnzl";
            break;
    }

    try {
        await mongoose.connect(dbUri);
        console.log("Database connected.");
    } catch (error) {
        console.log("Database failed to connect. Error: " + error);
    }
};


// Disconnect from database
async function dbDisconnect() {
    try {
        await mongoose.connection.close();
        console.log("Database disconnected.");
    } catch (error) {
        console.log("Database failed to disconnect. Error: " + error);
    }
}



module.exports = {
    dbConnect,
    dbDisconnect
};