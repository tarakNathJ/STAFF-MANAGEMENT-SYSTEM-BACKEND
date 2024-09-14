const mongoose = require('mongoose');

const ExpenceSchema = new mongoose.Schema({
    Send: {
        type: String,
    },
    CreatedAt: {
        type: Date
    },
    ExpenceTypeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenceType'
    },
    SenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Amount: {
        type: Number
    },
    Description: {
        type: String
    },
    Status_Details: {
        type: String
    }
})

module.exports = mongoose.model('Expence', ExpenceSchema)