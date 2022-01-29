const mongoose = require('mongoose');

const EmbedSchema = new mongoose.Schema({
    guild: { type: String, required: true },
    name: { type: String, required: true },
    author: {
        name: { type: String },
        url: { type: String },
        icon: { type: String }
    },
    title: { type: String },
    color: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    image: { type: String },
    url: { type: String },
    footer: {
        text: { type: String },
        icon: { type: String }
    }
})

const model = mongoose.model("Embeds", EmbedSchema);

module.exports = model;