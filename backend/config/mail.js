/** @fileoverview Nodemailer transporter configuration. */

'use strict';

const nodemailer = require('nodemailer');

/** 
 * Nodemailer transporter setup for sending emails.
 * Uses Gmail service and authentication via environment variables.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Sender email address.
    pass: process.env.EMAIL_PASS, // Sender email password.
  },
});

module.exports = transporter;
