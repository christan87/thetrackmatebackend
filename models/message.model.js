var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    read: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("Message", messageSchema);