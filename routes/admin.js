const { Router, request } = require("express");
const adminRouter = Router();
const { adminmodel, coursemodel} = require("../db");
const jwt=require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD}=require("../config");
const { adminMiddleware } = require("../middleware/admin");

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

adminRouter.post("/course",adminMiddleware,async function(req, res) {
    const adminId=req.userId;
    const {title,description,imageUrl,price}=req.body;
    const course = await coursemodel.create({
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
        creatorId: adminId
    })
    res.json({
        message: "Course Created",
        courseId: course._id
    })
})

adminRouter.put("/course",adminMiddleware,async function(req, res) {
    const adminId=req.userId;
    const {title,description,imageUrl,price}=req.body;
    const course = await coursemodel.updateOne({
        _id:courseId,
        creatorId: adminId
    },{
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price
    })
    res.json({
        message: "Course Updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware,async function(req, res) {
    const adminId=req.userId;
    const course = await coursemodel.find({
        creatorId: adminId
    })
    res.json({
        message: "Course updated"
    })
})

module.exports = {
    adminRouter: adminRouter
}