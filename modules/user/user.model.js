
const mongoose = require('mongoose');
const { type } = require('os');
const constants = require('../,../conifig/constants.js');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/,"Invailed Email Format"],
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        requiredq: true,

    },
    role:{
        type: String,
        enum: constants.userRoles,
        default: 'user',
    }
    
},
{timestamps: true});

module.exports = mongoose.model('User',userSchema);
