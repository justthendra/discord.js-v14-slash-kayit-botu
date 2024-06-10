const mongoose = require('mongoose');

const registerData = new mongoose.Schema({
    guildId: { type: String },
    unregRole: { type: String },
    regRole: { type: String },
    regAuthRole: { type: String },
    girlRole: { type: String },
    manRole: { type: String },
    regChannel: { type: String }

});

module.exports = mongoose.model('Register', registerData);