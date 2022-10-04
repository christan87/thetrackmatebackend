const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res)=>{
    User.find().then(
        users => {
            res.json(users)
        }
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
})

router.route("/add").post((req, res)=>{
    const useremail = req.body.useremail;
    const userAuthId = req.body.userAuthId;
    const userName = req.body.name
    const userData = req.body.userData;
    const newUser = new User({email: useremail, authId: userAuthId, name: userName, userData: userData});
    newUser.save().then(
        ()=> res.json("User added!")
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
})

//find authenticated user
router.route("/auth/:uid").get((req, res)=>{
    // populates user messages completely and 'then'populates the author field for each message but 'just' name and _id
    User.findOne({"authId": `${req.params.uid}`}).populate({path: "messages", populate: {path: "author", select: "name"}}).exec((err, user) => {
        if(err){
            res.status(400).json("Error: " + err)
        }else{
            // res.header("Access-Control-Allow-Origin", "*");
            res.json(user)
        }
        
    })
});

//update specific user
router.route("/update/:id").post((req, res)=>{
    User.findById(req.params.id).then(
        (user)=>{
            user.email = req.body.email;
            user.authId = req.body.authId;
            if(req.body.photoURL){
                user.photoURL = req.body.photoURL;
            }
            if(req.body.accessToken){
                user.accessToken = req.body.accessToken
            }
            if(req.body.projects){
                user.projects = req.body.projects
            }
            user.save().then(
                ()=> res.json("User updated!")
            ).catch(
                err => res.status(400).json("Error: " + err)
            )
        }
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
})

//update specific user data
router.route("/update-data/:id").post((req, res)=>{
    User.findById(req.params.id).then(
        (user)=>{
            
            user.userData.firstName = req.body.firstName
            user.userData.lastName = req.body.lastName
            user.userData.email = req.body.email
            user.userData.website = req.body.website
            user.userData.bio = req.body.bio

            user.save().then(
                ()=> res.json("User updated!")
            ).catch(
                err => res.status(400).json("Error: " + err)
            )
        }
    ).catch(
        err => res.status(400).json("Error: " + err)
    )
})

module.exports = router;