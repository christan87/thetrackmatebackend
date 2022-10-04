const router = require("express").Router();
const Ticket = require("../models/ticket.model");
const Project = require("../models/project.model");
const Comment = require("../models/comment.model");

router.route("/add").post((req, res)=>{
    const ticketName = req.body.name;
    const priority = req.body.priority;
    const type = req.body.type;
    const description = req.body.description;
    const projectId = req.body.project.id;
    const projectName = req.body.project.name;
    // const assignedTo = req.body.assignedTo;
    const admin = req.body.admin;
    const newTicket = new Ticket({
        name: ticketName, 
        priority: priority,
        type: type,
        description: description,
        project: {
            id: projectId,
            name: projectName
        },
        admin: admin,
        // assigned: [assignedTo], 
        admin_privilages: [admin]
    });
    newTicket.save().then(()=>{ 
        Project.findById(projectId).then((project)=>{
            project.tickets = [...project.tickets, newTicket._id]
            project.save();
        }).catch((err)=>{
            res.status(400).json("newTicket.save>Project.findById>Error: " + err)
        })
        res.json(newTicket._id)
    }).catch(
        err => res.status(400).json("Error: " + err)
    )
})

//find specific ticket
router.route("/:id").get((req, res)=>{
    Ticket.findById(req.params.id).populate("comments").then(
        ticket => res.json(ticket)
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
})

//find users tickets
router.route("/user/:id").get((req, res)=>{
    Ticket.find().where("admin").equals(req.params.id).populate("comments").exec((err, foundTickets)=>{
        if(err){
            console.log("No Tickets Found: ", err)
        }else{
            res.json({tickets: foundTickets})
        }
    });
})

//update ticket
router.route("/update/:id").put((req, res)=>{
    Ticket.findById(req.params.id).then((ticket)=>{
        ticket.name = req.body.name;
        ticket.status = req.body.status;
        ticket.priority = req.body.priority;
        // ticket.type = req.body.type;
        ticket.description = req.body.description
        // ticket.assigned = req.body.assignedTo;
        // ticket.admin_privilages = req.body.admin_privilages;
        ticket.private = req.body.private;
        ticket.save();
        res.json(ticket._id)
    }).catch(
        err => res.status(400).json("Error: " + err)
    )
})

//Delete Ticket and Comments
router.route("/delete/:id").delete((req, res)=>{
    Ticket.findById(req.params.id, (err, ticket)=>{
        if(err){
            console.log("routes>tickets.js>Delete: ", err)
        }else{
            Comment.deleteMany({_id: {$in: ticket.comments}}, (err2, comment)=>{
                if(err){
                    console.log("routes>tickets.js>Delete: ", err2)
                }
                else{
                    res.send("deleted")
                }
            })
        }
        ticket.remove();
    });
});

module.exports = router;