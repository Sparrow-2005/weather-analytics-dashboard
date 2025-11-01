const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    favoriteCities: {
        type: [String], // ✅ Correct array of strings
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
