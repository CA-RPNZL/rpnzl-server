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
        // console.log("Database connected to " + dbUri);
    } catch (error) {
        console.log(`Database failed to connect. Error:\n${JSON.stringify(error)}`);
    }
}


module.exports = {
    dbConnect
}