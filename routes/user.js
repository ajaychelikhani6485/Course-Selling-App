const { Router } = require("express");
const { usermodel } = require("../db");
const jwt=require("jsonwebtoken");
const JWT_USER_PASSWORD="testinguser";

const userRouter = Router();

userRouter.post("/signup",async function(req, res) {
    const {email,password,firstName,lastName}=req.body;
    //TODO: Adding zod validation
    //TODO: Hash the password so plaintext password is not stored in the DB
    //TODO: Put inside a try catch block
    await usermodel.create({
        email:email,
        password:password,
        firstName:firstName,
        lastName:lastName
    })
    res.json({
        message: "Signup succeeded"
    })
})

userRouter.post("/signin",async function(req, res) {
    const {email,password}=req.body;
    //TODO: Ideally password should be hashed and hence you cant compare the user provided password and the database password
    const user=await usermodel.findOne({ 
        email:email,
        password:password
    });
    if(user){
        const token=jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD);
        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

userRouter.get("/purchases", function(req, res) {
    res.json({
        message: "purchases endpoint"
    })
})

module.exports = {
    userRouter: userRouter
}