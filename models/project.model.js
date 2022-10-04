const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    private: {
        type: Boolean
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tickets:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        }
    ],
    collaborators:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
})

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;