const express = require('express');
const userRouter = express.Router();
const User = require('../models/user')

userRouter.get("/login", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Login page"
    });
});

userRouter.get("/dashboard", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Admin dash"
    });
});

userRouter.post("/register", async (request, response) => {
    let newUser = new User({
        username: request.body.username,
        password: request.body.password,
        email: request.body.email
    })

    await newUser.save()
                .catch(error =>{
                    console.log(error.errors)
            })

    response.send(newUser)
})

module.exports = userRouter;