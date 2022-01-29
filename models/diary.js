const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
    index: { type: Number, index: {unique: true} },
    description: { type: String },
    url: { type: String, required: true, unique: true }
})

const model = mongoose.model("Diary", DiarySchema);

module.exports = model;