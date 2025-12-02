const mongoose = require("mongoose");

const HostSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    org_name: String
});

const Host = mongoose.model("Host", HostSchema);

module.exports = Host;