const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Email Config Debug:', {
    user: process.env.EMAIL_USER ? 'Set' : 'Not set',
    pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logs
    logger: true  // Enable logger
});

// Test the connection
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email server connection error:', error);
    } else {
        console.log('Email server connection successful');
    }
});

async function sendEmail(to, subject, message) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: message
        };

        console.log('Attempting to send email:', {
            to,
            subject,
            from: process.env.EMAIL_USER
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { sendEmail };