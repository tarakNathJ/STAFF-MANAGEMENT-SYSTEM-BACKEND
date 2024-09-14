const mongoose = require('mongoose');

const ExpenceTypeSchema = new mongoose.Schema({
    Send: {
        type: String,
    },
    CreatedAt: {
        type: Date
    },
    ExpenceType: {
        type: string
    },
    Status_Details: {
        type: String
    }
})

module.exports = mongoose.model('ExpenceType', ExpenceTypeSchema)