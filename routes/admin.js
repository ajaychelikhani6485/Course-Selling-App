const { Router, request } = require("express");
const adminRouter = Router();
const { adminmodel} = require("../db");
const JWT_ADMIN_PASSWORD="testingadmin";
const jwt=require("jsonwebtoken");
//bcrypt,zod,jsonwebtoken
adminRouter.post("/signup", async function(req, res) {
    const {email,password,firstName,lastName}=req.body;
    //TODO: Adding zod validation
    //TODO: Hash the password so plaintext password is not stored in the DB
    //TODO: Put inside a try catch block
    await adminmodel.create({
        email:email,
        password:password,
        firstName:firstName,
        lastName:lastName
    })
    res.json({
        message: "Signup succeeded"
    })
})

adminRouter.post("/signin",async function(req, res) {
    const {email,password}=req.body;
    //TODO: Ideally password should be hashed and hence you cant compare the user provided password and the database password
    const admin=await adminmodel.findOne({ 
        email:email,
        password:password
    });
    if(admin){
        const token=jwt.sign({
            id:admin._id
        },JWT_ADMIN_PASSWORD);
        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

adminRouter.post("/course", function(req, res) {
    res.json({
        message: "course endpoint"
    })
})

adminRouter.put("/course", function(req, res) {
    res.json({
        message: "course endpoint"
    })
})

adminRouter.get("/course/bulk", function(req, res) {
    res.json({
        message: "course bulk endpoint"
    })
})

module.exports = {
    adminRouter: adminRouter
}