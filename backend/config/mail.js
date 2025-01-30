const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // My email witch will send the confirmation
        pass: process.env.EMAIL_PASS, // My pass of an email
    },
});

module.exports=transporter;