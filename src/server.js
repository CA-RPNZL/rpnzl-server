// Import Express JS
const express = require('express');


// Create an instance of Express
const app = express();


const PORT = process.env.PORT || 3000;


app.get('/', (request, response) => {
    response.send('Hello world!');
});


module.exports = {
    app, PORT
}