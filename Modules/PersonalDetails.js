const mongoose = require('mongoose');

const PersonalDetailsSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Email: {
        type: String,
    },
    PhoneNumber: {
        type: Number,
    },
    Address: {
        type: String,

    },
    AccountType: {
        type: String,
        required: ['ADMIN', 'MANAGER', 'DEVELOPER', 'HR']

    },
    Sallary: {
        type: Number
    },
    PaymentDetailsID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentDetails'
    }],
    AccountDetailsID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountDetails'
    },
    ImageUrl: {
        type: String,
    },
    Status: {
        type: Date,
    }
})

module.exports = mongoose.model('PersonalDetails', PersonalDetailsSchema)