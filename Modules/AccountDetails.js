const mongoose = require('mongoose');

const AccountDetailsSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    GooglePayUpi: {
        type: String,
    },
    BankAccountNumber: {
        type: String,
    },

    IfSC_code: {
        type: String

    },
    PaymentDetailsID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentDetails'
    }],
    Status: {
        type: Date,
    }
})

module.exports = mongoose.model('AccountDetails', AccountDetailsSchema)