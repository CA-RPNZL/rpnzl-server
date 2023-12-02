// Import and configure dotenv
require("dotenv").config();

// Connect to database
const { dbConnect } = require("./database");

const { app } = require("./server");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async ()=> {
    await dbConnect();
    console.log("The server is running on port: " + PORT);
});