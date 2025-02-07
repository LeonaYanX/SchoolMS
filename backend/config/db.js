/** @fileoverview MongoDB connection setup. */

'use strict';

const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 * Logs success or exits on failure.
 * @return {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process with failure.
  }
};

module.exports = connectDB;
