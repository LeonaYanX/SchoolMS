const nodemailer = require('nodemailer');

// Конфигурация транспорта
const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER, // My email
        pass: process.env.EMAIL_PASS, // My pass
    },
});

// Функция для отправки письма
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
