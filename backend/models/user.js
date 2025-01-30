const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const cron = require('node-cron');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [2, "First name must contain at least 2 characters."],
        maxlength: [30, "First name must contain a maximum of 50 characters"],
        match: [/^[a-zA-Z\s]+$/, "First name must contain only letters and spaces."]
    },
    lastName: {
        type: String,
        required: true,
        minlength: [2, "Last name must contain at least 2 characters."],
        maxlength: [30, "Last name must contain a maximum of 50 characters"],
        match: [/^[a-zA-Z\s]+$/, "Last name must contain only letters and spaces."],
    },
    role: {
        type: String,
        enum: ['student', 'teacher','admin'], 
        required: true,
        index: true
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
        index:true
    },
    IsApproved:{
        type:Boolean,
        default:false,
        index: true
    },
    blockExpiry: {
        type:Date,
        required: true    
    },
    lastLogin: {
         type: Date, 
         default: null 
    }, // last login time 
    duration: {
         type: Number, 
         default: 0 
    } // duration in minutes

});
 
//indexed 
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ IsApproved: 1 });
userSchema.index({ IsBlocked: 1 });


// Hashing the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Comparing the password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Checking the expiration of blocking period
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
