const mongoose = require('mongoose');

const OverTimeSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Start: [{
        type: Date
    }],
    End: {
        type: Date
    },
    Duration: [{
        type: Number
    }],
    Status: [{
        type: Date
    }]
})

module.exports = mongoose.model('OverTime', OverTimeSchema)