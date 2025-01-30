const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String
        , required: true
        , unique: true 
        ,minlength: [3, "Group name must contain at least 3 characters."]
        ,maxlength: [50, "Group name must contain a maximum of 50 characters"]
        ,match: [/^[a-zA-Z0-9\s]+$/, "Group name must contain only letters, numbers, and spaces."],
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Group', groupSchema);
