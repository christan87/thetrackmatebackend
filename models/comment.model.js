var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        avatar: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);