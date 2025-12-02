const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    event_name: String,
    event_location: String,
    event_start: Date,
    event_end: Date,
    event_price: String,
    event_desc: String,
    event_promo: String
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;