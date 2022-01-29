const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    commands: { type: Number, default: 0 },
    warnings: [{
        guild: { type: String },
        author: { type: String },
        reason: { type: String, default: 'No reason given' },
        date: {
            raw: { type: Number },
            formatted: { type: String }
        }
    }]
})

const model = mongoose.model("Users", UserSchema);

module.exports = model;