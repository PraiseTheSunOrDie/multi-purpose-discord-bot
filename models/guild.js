const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, requred: true},
    prefix: { type: String, required: true },
    staffRoles: { type: Array },
    logChannel: { type: String, default: null },
    antiraid: {
        status: { type: Boolean, required: true, default: false },
        action: { type: String, required: true, default: 'ban'},
        limit: { type: Number, required: true, default: 25}
    },
    raidmode: {
        status: { type: Boolean, required:true, default: false },
        action: { type: String, required: true, default: 'ban'},
    },
    blacklist: { type: Array },
    memes: { type: Array },
    locked: { type: Array },
})

const model = mongoose.model("Guilds", GuildSchema);

module.exports = model;