
const transporter = require('../config/mail');


const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"SchoolMS" <${process.env.EMAIL_USER}>`, // Sender's adress
        to, // Reciever adress
        subject, 
        text, 
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
