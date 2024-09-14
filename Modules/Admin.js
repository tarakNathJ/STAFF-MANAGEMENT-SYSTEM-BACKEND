const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    PersonalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonalDetails'
    },
    LICENCE_Number: {
        type: String
    },
    PaymentDetailsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentDetails'
    }],
    OverTimeID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OverTime'
    }],
    Status: {
        type: Date
    }
})

module.exports = mongoose.model('Admin', AdminSchema)