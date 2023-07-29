// Get .env
const dotenv = require('dotenv');
dotenv.config();

// Import express and initialize
const express = require('express');
const app = express();

// Configure host and port & provide default values
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

// Import mongoose
const mongoose = require('mongoose');

// Configure helmet
const helmet = require('helmet');
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy(
    {
        directives: {
            defaultSrc: ["'self'"]
        }
    }
));

// Configure CORS
const cors = require('cors');
var corsOptions = {
origin: ["http://localhost:3001", "https://survey-sorter-fe.onrender.com", "https://survey-sorter.onrender.com"],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Add axios
const axios = require("axios");

// Enable JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Set db url
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/survey-app-test";
        break;
    case "development":
        databaseURL = "mongodb://localhost:27017/survey-app-dev";
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
};

// Connect to the db
async function dbConnect() {
    try {
      await mongoose.connect(databaseURL);
      console.log("Database connected!");
    } catch (error) {
      console.log(`dbConnect failed, error:`, error);
    }
  }
  
dbConnect()


// Controllers
const surveyController = require('./controllers/surveyRoutes');
app.use('/surveys', surveyController)

const usersController = require('./controllers/userRoutes');
app.use('/admin', usersController)

const responsesController = require('./controllers/responseRoutes');
app.use('/responses', responsesController);

const reCAPTCHAController = require('./controllers/reCAPTCHA');
app.use('/reCAPTCHA', reCAPTCHAController);

// Routes
app.get('/', (request, response) => {
    response.json({
        message:"Hello world!"
    });
});


// 404 route (Keep at bottom of file)
app.get('*', (request, response) => {
    response.status(404).json({
        message: "404: The requested content was not found",
        attemptedPath: request.path
    });
});

// Exports
module.exports = {
    HOST,
    PORT,
    app
}