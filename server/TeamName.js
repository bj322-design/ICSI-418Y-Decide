const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    team_name: String,
    manager_id: String,
    event_id: String,
    members: [String]
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;