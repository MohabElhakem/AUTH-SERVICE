const mongoose = require('mongoose');
const refreshToken = require('../token/refresh.token');
const { type } = require('os');

const sessionSchema = new mongoose.Schema({
    userID :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" ,
        required: true,
    },
    refreshTokenHash:{
        type: String,
        required: true,
    },
    userAgent:{
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true, 
    },
    expiresAt:{
        type: Date,
        required: true,
    },
},{
    timestamps: true,
});

sessionSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

module.exports = mongoose.model('Session' , sessionSchema);

// Session Model
// Stores user sessions with refresh tokens
// Contains userID, refreshToken, userAgent, ip, and expiration date
// Hashes refresh tokens for security