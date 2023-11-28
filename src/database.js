// Import Mongoose
const mongoose = require('mongoose');


// Connect or create and connect to a database
async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Database connected!');
    } catch (error) {
        console.log(`This is ${process.env.DB_URI}`);
        console.log(`Database failed to connect. Error:\n${JSON.stringify(error)}`);
    }
}

module.exports = {
    dbConnect
}