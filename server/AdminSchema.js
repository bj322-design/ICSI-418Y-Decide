const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    f_name: String,
    l_name: String,
    username: String,
    password: String
});

const Admin = mongoose.model('admins', AdminSchema);

module.exports = Admin;