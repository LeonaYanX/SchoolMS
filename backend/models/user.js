const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cron = require('node-cron');

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
        enum: ['student', 'teacher','admin'], 
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
    passwordLastChangedAt: { 
        type: Date,
        default: null
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
    },
    lastLogin: {
         type: Date, 
         default: null 
    }, // Поле для записи времени последнего логина
    duration: {
         type: Number, 
         default: 0 
    } // Поле для записи длительности нахождения (в минутах)

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
    try {
      if (this.IsBlocked && this.blockExpiry && new Date() > this.blockExpiry) {
        this.IsBlocked = false;
        this.blockExpiry = null;
        await this.save();
        console.log(`User has been unblocked.`);
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
    }
  };


module.exports = mongoose.model('User', userSchema);
