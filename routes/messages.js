const router = require("express").Router();
let Message = require("../models/message.model")
let User = require("../models/user.model");

router.route("/message/:id").post((req, res)=>{
    User.findById(req.params.id).then(
        user =>{
            Message.create(req.body, (err, message)=>{
                try{
                    message.type = req.body.type;
                    message.subject = req.body.subject;
                    message.text = req.body.text;
                    message.author = req.body.author;
                    message.recipient = req.body.recipient;
                    //save message
                    message.save((err)=>{
                        if(err){
                            console.log("message.save()>", err)
                        }
                    });
                    user.messages.push(message._id);
                    user.save();
                    res.send("Message Sent!")
                }catch(err){
                    console.log("User Message Error: ", err)
                }

            })
        }
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
});

router.route('/read/:messageId').put((req, res)=>{
    Message.findById(req.params.messageId).then(message=>{
        try {
            message.read = req.body.read;
            message.save();
            res.send('message read!');
        } catch (err) {
            
        }
    }).catch(
        err => res.status(400).json("Message Update Error: " + err)
    )
})

router.route("/delete/:id").post((req, res)=>{
    Message.findById(req.params.id).then(message=>{
        try{
            if(message){
                message.remove()
            }
        }catch(err){
            console.log("Message Not Deleted Error: ", err)
        }
    }).catch(
        err => res.status(400).json("Error: " + err)
    )
})

router.route("/delete/:userId/:messageId").post((req, res)=>{
    User.findById(req.params.userId).then(
        user=>{
            try{
                let oldMessages = user.messages;
                user.messages = user.messages.filter(message=> message.toString() !== req.params.messageId)
                if(oldMessages.length == user.messages.length){console.log("refference delete error")}
                user.save().then(
                    ()=> res.json("Message Refference Removed From User!")
                ).catch(
                    err => res.status(400).json("Error: " + err)
                )
            }catch(err){
                console.log("Message Refference Not Deleted on User Error: ", err)
            }
        }
    ).catch()
    Message.findById(req.params.messageId).then(message=>{
        try{
            if(message){
                message.remove()
            }
        }catch(err){
            console.log("Message Not Deleted Error: ", err)
        }
    }).catch(
        err => res.status(400).json("Error: " + err)
    )
})

router.route("/multidelete/:userId").post((req, res)=>{
    User.findById(req.params.userId).then(
        user=>{
            try{
                let oldMessages = user.messages;
                user.messages = user.messages.filter(message=> !req.body.messages.includes(message.toString()))
                if(oldMessages.length == user.messages.length){console.log("refference delete error")}
                user.save().then(
                    ()=> res.json("Message Refference Removed From User!")
                ).catch(
                    err => res.status(400).json("Error: " + err)
                )
            }catch(err){
                console.log("Message Refference Not Deleted on User Error: ", err)
            }
        }
    ).catch()
    req.body.messages.forEach(messageId => {
        Message.findById(messageId).then(message=>{
            try{
                if(message){
                    message.remove()
                }
            }catch(err){
                console.log("Message Not Deleted Error: ", err)
            }
        }).catch(
            err => res.status(400).json("Error: " + err)
        )
    });
})

router.route("/reply/:id").post((req, res)=>{
    User.findById(req.params.id).then(
        user =>{
            Message.create(req.body, (err, message)=>{
                try{
                    message.type = req.body.type;
                    message.subject = req.body.subject;
                    message.text = req.body.text;
                    message.author = req.body.author;
                    message.recipient = req.body.recipient;
                    //save message
                    message.save((err)=>{
                        if(err){
                            console.log("message.save()>", err)
                        }
                    });
                    user.messages.push(message._id);
                    user.save();
                    res.send("Reply Sent!")
                }catch(err){
                    console.log("User Reply Error: ", err)
                }

            })
        }
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
});

module.exports = router;