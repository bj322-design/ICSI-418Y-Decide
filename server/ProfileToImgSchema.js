const mongoose = require('mongoose');

const ProfileToImgSchema = new mongoose.Schema({
    // Use username as the unique identifier for simplicity, as requested
    username: {
        type: String,
        required: true,
        unique: true
    },
    imgURL: {
        type: String,
        default: '' // The URL/path to the image file
    }
});

const ProfileToImg = mongoose.model('ProfileToImg', ProfileToImgSchema);

module.exports = ProfileToImg;