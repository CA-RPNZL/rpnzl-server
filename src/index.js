// Import and configure dotenv
require("dotenv").config();

const { dbConnect } = require("./database");
const { app } = require("./server");

// If process.env.PORT is not found, use default value.
const PORT = process.env.PORT || 3001;

app.listen(PORT, async ()=> {
    // Connect to database
    await dbConnect();
    console.log("The server is running on port: " + PORT);
})