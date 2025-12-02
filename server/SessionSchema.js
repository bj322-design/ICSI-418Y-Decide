const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    session_code: String, // 4 digit invite code
    host_id: String,      // ID of Social Planner
    event_ids: [String],  // events list selected by filters
    votes: [{             // store votes here later
        user_id: String,
        event_id: String,
        vote: String
    }],
    status: { type: String, default: 'active' }
});

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;
