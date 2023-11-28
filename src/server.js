// Import Express JS
const express = require('express');


// Create an instance of Express
const app = express();


app.get('/', (request, response) => {
    response.send('Hello world!');
});


module.exports = {
    app
}