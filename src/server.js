// Get .env
const dotenv = require('dotenv');
dotenv.config();

// Import express and initialize
const express = require('express');
const app = express();

// Configure host and port & provide default values
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

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
origin: ["http://localhost:3000", /*TODO: Add url for deployed app */],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Enable JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Controllers
const surveyController = require('./controllers/surveyRoutes');
app.use('/surveys', surveyController)

const usersController = require('./controllers/usersRoutes');
app.use('/admin', usersController)

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