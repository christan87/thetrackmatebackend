const router = require("express").Router();
let Project = require("../models/project.model");
let Ticket = require("../models/ticket.model");
let Comment = require("../models/comment.model");


router.route("/add").post((req, res)=>{
    const name = req.body.name;
    const description = req.body.description;
    const priority = req.body.priority;
    const status = req.body.status;
    const private = req.body.private;
    const admin = req.body.admin;
    const newProject = new Project({
        name: name, 
        description: description,
        priority: priority,
        status: status,
        private: private,
        admin: admin
    });
    newProject.save().then(
        ()=> res.json(newProject)
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
})

//find users projects
router.route("/user/:id").get((req, res)=>{
    Project.find().where("admin").equals(req.params.id).populate("tickets").exec((err, foundProjects)=>{
        if(err){
            console.log("No Projecta Found: ", err)
        }else{
            res.json({projects: foundProjects})
        }
    });
})

//find specific project
router.route("/:id").get((req, res)=>{
    Project.findById(req.params.id).then((project)=>{
        return res.json(project)
    }).catch((err)=>{
        res.status(400).json("Error: " + err)
    })
});

//update project
router.route("/update/:id").put((req, res)=>{
    Project.findById(req.params.id).then((project)=>{
        project.name = req.body.name;
        project.assigned = req.body.assignedTo;
        project.status = req.body.status;
        project.priority = req.body.priority;
        project.description = req.body.description;
        project.private = req.body.private;
        project.tickets = req.body.tickets;
        if(req.body.collaborators){
            project.collaborators = req.body.collaborators;
        }
        project.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.json(project._id)
    }).catch(
        err => res.status(400).json("Error: " + err)
    )
})

router.route("/update-assigned/:id").put((req, res)=>{
    Project.findById(req.params.id).then((project)=>{
        if(req.body.collaborators){
            project.collaborators = req.body.collaborators;
        }
        project.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.json(project._id)
    }).catch(
        err => res.status(400).json("Error: " + err)
    )
})

router.route('/delete/:projectId').delete((req, res)=>{
    let deleteTickets = null;
    let deleteComments = null;
    Project.findById(req.params.projectId).then((project)=>{
        if(project){
            deleteTickets = project.tickets;
            deleteTickets.forEach(tickets=>{
                Ticket.findById(tickets).then((ticket)=>{
                    deleteComments = ticket.comments;
                    deleteComments.forEach(comments=>{
                        Comment.findById(comments).then((comment)=>{
                            console.log("IN!")
                            comment.remove();
                        }).catch(err=>{
                            console.log("Error removing Comment from project delete: ", err)
                        })
                    })
                    ticket.remove();
                }).catch(err=>{
                    console.log("Error removing Ticket from project delete: ", err)
                })
            })
            project.remove();
            res.send("Project deleted!")
        }
    }).catch(err=>{
        res.status(400).json('Error: ' + err)
    })
})
module.exports = router;