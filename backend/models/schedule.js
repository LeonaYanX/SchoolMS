const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    subject: { type: String, required: true ,
        minlength: [5, "Subject must contain at least 5 characters."],
        maxlength: [20, "Subject must contain a maximum of 20 characters"],
        match: [/^[a-zA-Z0-9\s]+$/, "Subject must contain only letters, numbers, and spaces."], },
        //if we have a list , todo - make an enum.
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
