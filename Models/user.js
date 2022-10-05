const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 50,
        },
        password: {
            type: String,
            required: true,
            maxlength: 80,
        },
        status: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending',
        },
        verificationToken: {
            type: String,
            unique: true,
        },
        profilePhoto: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model('User', userSchema);
module.exports = { userModel };