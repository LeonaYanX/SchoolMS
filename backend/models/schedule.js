const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    subject: { type: String, required: true },//если будет список сделать энам и валидацию
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
