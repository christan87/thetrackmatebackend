var express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

var app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB database connection extablished successfully")
})

//routes begin

const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const ticketsRouter = require("./routes/tickets")
const commentsRouter = require("./routes/comments")
const messagesRouter = require("./routes/messages")

app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/tickets", ticketsRouter);
app.use("/comments", commentsRouter);
app.use("/messages", messagesRouter);

app.get("/test", (req, res)=>{
    res.json("Test Success")
})

//routes end

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})