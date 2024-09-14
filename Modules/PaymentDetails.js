const mongoose = require('mongoose');

const PaymentDetailsSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Salary: {
        type: Number
    },
    EmployName: {
        type: String
    },
    Status: {
        type: Date,
    }
})

module.exports = mongoose.model('PaymentDetails', PaymentDetailsSchema)