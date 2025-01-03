
const transporter = require('../config/mail');


const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"SchoolMS" <${process.env.EMAIL_USER}>`, // Адрес отправителя
        to, // Кому отправить
        subject, // Тема письма
        text, // Текстовое содержимое письма
        html, // HTML-содержимое письма
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
