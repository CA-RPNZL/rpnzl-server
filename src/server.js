// Import Express JS
const express = require("express");

// Create an instance of Express
const app = express();

// Parse incoming JSON data from HTTP request
app.use(express.json());

// Parse incoming URL encoded form data from HTTP request
app.use(express.urlencoded({extended:true}));


// GET
app.get("/", (request, response) => {
    response.send("Hello world!");
});


module.exports = {
    app
}