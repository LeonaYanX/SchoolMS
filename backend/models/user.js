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
        enum: ['student', 'teacher','admin'], // проверить будет ли так работать
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
    },
    blockExpiry: {
        type:Date,    
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

// Проверка истечения срока блокировки
userSchema.methods.checkAndUnblock = async function () {
    if (this.IsBlocked && this.blockExpiry && new Date() > this.blockExpiry) { // Условие понять
        this.IsBlocked = false;
        this.blockExpiry = null;
        await this.save();
    }
};

module.exports = mongoose.model('User', userSchema);
