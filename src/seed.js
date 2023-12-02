const mongoose = require('mongoose');
const { dbConnect } = require('./database');
const { User } = require('./models/UserModel');


dbConnect().then(async ()=> {
    console.log('Creating seed data');

    let newAdmin = new User({
        firstName: 'George',
        lastName: 'Sheridan',
        mobileNumber: 0o411222333,
        email: 'admin@mail.com',
        password: 'adminpassword',
        is_admin: true,
    });
    let newHairstylist = new User({
        firstName: 'Michelle',
        lastName: 'Smith',
        mobileNumber: 0o433444555,
        email: 'michelle@mail.com',
        password: 'hairstylistpassword',
        is_hairstylist: true,
        // Uses ID value of services eg. [cutServiceID, consultationServiceId]
        services: [0, 4],
    });
    let newUser = new User({
        firstName: 'Bianca',
        lastName: 'Lopez',
        mobileNumber: 0o477444556,
        email: 'bianca@mail.com',
        password: 'clientpassword',
    });
});

