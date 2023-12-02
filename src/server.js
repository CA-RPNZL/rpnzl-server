// Import Express JS
const express = require("express");

// Create an instance of Express
const app = express();

// Configure Helmet for server security
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc:["'self'"]
    }
}));

// Parse incoming JSON data from HTTP request
app.use(express.json());

// Parse incoming URL encoded form data from HTTP request
app.use(express.urlencoded({extended:true}));


// GET
app.get("/", (request, response) => {
    response.send("Hello world!");
});

// Attach service controller routes
const serviceController = require("./controllers/ServiceController");
app.use("/services", serviceController);


module.exports = {
    app
}