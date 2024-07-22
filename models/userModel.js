const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        unique: true,
    },
    // email: {
    //     type: 'string',
    //     lowercase: true,
    //     required: false,
    //     unique: false,
    // },
    password: {
        type: 'string',
        required: true,
    },
    role: {
        type: 'string',
        required: true,
        enum: ['admin', 'supervisor', 'operator'],
    },
    refresh_token: {
        type: 'string',
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;