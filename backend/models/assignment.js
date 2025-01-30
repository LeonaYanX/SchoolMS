const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Title must contain at least 3 characters."],
        maxlength: [50, "Title must contain a maximum of 50 characters"],
        match: [/^[a-zA-Z0-9\s]+$/, "Title must contain only letters, numbers, and spaces."],
    }, 
    description: {
        type: String,
        required: true,
        minlength: [3, "Description must contain at least 3 characters."],
        maxlength: [50, "Description must contain a maximum of 50 characters"],
        match: [/^[a-zA-Z0-9\s]+$/, "Description must contain only letters, numbers, and spaces."],
    }, 
    deadline: {
        type: Date,
        required: true
    }, 
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }, 
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    submissions: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }, 
            fileUrl: {
                type: String,
                required: true,
                validate: {
                    validator: function (value) {
                        return /^(https?:\/\/.*\.(jpg|jpeg|png|gif|pdf|docx?))$/i.test(value);
                    },
                    message: "Wrong file URL format"
                }
            }, 
            submittedAt: {
                type: Date,
                default: Date.now
            }, 
            grade: {
                value: { type: Number, min: 0, max: 100 }, 
                feedback: { type: String, default: '' }, 
                gradedAt: { type: Date, default: Date.now }, 
            }
        }
    ]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
