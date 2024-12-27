const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // My email
        pass: process.env.EMAIL_PASS, // My pass
    },
});

module.exports=transporter;