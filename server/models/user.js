const mongoose = require('mongoose')

const model = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = new mongoose.model("users2", model)