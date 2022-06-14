const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {childSchema} = require('./child');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    children:{
        type: [childSchema],
        required: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;