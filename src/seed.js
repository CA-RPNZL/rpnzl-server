// Import Mongoose
const mongoose = require('mongoose');
const { dbConnect } = require('./database');
const { Services } = require('./models/ServicesModel');

dbConnect().then(async ()=> {
    console.log('Creating seed data');

    // Salon services

    let cut = new Services({
        name: 'Cut',
        price: '$40+',
        description: 'Includes: Hair wash, blow dry and cut',
        duration: '30'
    });

    let perm = new Services({
        name: 'Perm',
        price: '$250 - $500',
        description: '',
        duration: '120'
    });

    let colour = new Services({
        name: 'Colour',
        price: '$270+',
        description: '',
        duration: '120'
    });

    let cutAndColour = new Services({
        name: 'Cut & colour',
        price: '$280 - $530',
        description: '',
        duration: '150'
    });

    let consultation = new Services({
        name: 'Consultation',
        price: '0',
        description: '',
        duration: '15'
    });


});