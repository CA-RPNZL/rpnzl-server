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


// Configure CORS
const cors = require("cors");
// Allowed origin array
var corsOptions = {
    // origin: 
    // [
    //     "http://localhost:3000",
    //     "https://ca-rpnzl-15265a6e99eb.herokuapp.com/"
    // ],
    origin: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


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

// Attach auth controller routes
const authController = require("./controllers/AuthController");
app.use("/", authController);

// Attach user controller routes
const userController = require("./controllers/UserController");
app.use("/users", userController);

// Attach Appointment controller routes
const appointmentController = require("./controllers/AppointmentController");
app.use("/appointments", appointmentController);

// Attach error route
app.get("*", (request, response) => {
    response.status(404).json({
        message: "This path could not be found!",
        attemptedPath: request.path
    });
});


module.exports = {
    app
}