const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
        type: String,
        required: true,
    },
    IsPassChangeAvailable: {
        type: Boolean,
        default: true,
    },
    IsBlocked: {
        type: Boolean,
        default: false,
    },
    IsApproved:{
        type:Boolean,
        default:false,
    }
});

// Хешируем пароль перед сохранением
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Сравнение пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
