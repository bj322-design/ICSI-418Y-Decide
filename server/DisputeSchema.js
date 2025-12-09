const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
    reporter_username: { type: String, required: true }, // Who complained
    accused_username: { type: String, required: true },  // Who is being reported
    reason: { type: String, required: true },            // Why?
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', disputeSchema);