const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    session_code: String,
    host_id: String,
    event_ids: [String],
    votes: [{
        user_id: String,
        event_id: String,
        vote: String
    }],
    chat_log: [{
        sender: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
    }],
    status: { type: String, default: 'active' }
});

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;
