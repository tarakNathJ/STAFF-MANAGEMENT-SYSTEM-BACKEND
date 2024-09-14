const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Password: {
        type: String,
    },
    CreatedAt: {
        type: Date,
    },
    AccountType: {
        type: String,
        required: ['ADMIN', 'MANAGER', 'DEVELOPER', 'HR']

    },
    PersonalDetailsID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonalDetails'
    },
    OverDutyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OverTime'
    },
    UpdateDate: {
        type: Date,

    }
})

module.exports = mongoose.model('User', UserSchema)