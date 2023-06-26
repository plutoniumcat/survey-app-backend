const express = require('express');
const userRouter = express.Router();

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

userRouter.post("/createaccount", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Create new user"
    });
});

module.exports = userRouter;