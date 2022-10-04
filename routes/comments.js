const router = require("express").Router();
const Ticket = require("../models/ticket.model");
const Comment = require("../models/comment.model")

router.route("/ticket/:id").post((req, res)=>{
    Ticket.findById(req.params.id).then(
        ticket =>{
            Comment.create(req.body, (err, comment)=>{
                try{
                    comment.text = req.body.text;
                    comment.author.id = req.body.author.id;
                    comment.author.username = req.body.author.name;
                    comment.author.avatar = req.body.author.avatar;
                    //save comment
                    comment.save();
                    ticket.comments.push(comment);
                    ticket.save();
                    res.send("Comment Added!")
                }catch{
                    console.log("Ticket Comment Error: ", err)
                }

            })
        }
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
});

router.route('/delete/:ticketId/:commentId').delete((req, res)=>{
    Ticket.findById(req.params.ticketId).then(ticket=>{
        let oldTicketComments = ticket.comments;
        ticket.comments = ticket.comments.filter(comment=> comment.toString() !== req.params.commentId);
        if(oldTicketComments.length == ticket.comments.length) return console.log("Error Deleting Comment...")
        ticket.save().then(()=>{
            res.json('Comment reference removed from ticket!')
        }).catch(err=>console.log('Comment reference not removed from ticket!'))
    }).catch(
        err => res.status(400).json("Ticket Not Found Error: " + err)
    )
    Comment.findById(req.params.commentId).then((comment)=>{
        try {
            if(comment){
                comment.remove();
            }
        } catch (err) {
            console.log("Comment not removed, err")
        }
    }).catch(
        err=> console.log('Comment not reomved: ', err)
    )
})

module.exports = router;