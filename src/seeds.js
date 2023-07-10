const mongoose = require('mongoose');
const { databaseConnector } = require('./database');

// Import models to be seeded
const {User} = require('./models/userModel');
const {Survey} = require('./models/surveyModel');
const { Response } = require('./models/responseModel');

// Make sure this file can read environment variables.
const dotenv = require('dotenv');
dotenv.config();

// Create raw data to seed users
const users = [
    {
        username: "TestUser1",
        password: "123456",
        email: "test@test.com"
    },
    {
        username: "TestUser2",
        password: "123456",
        email: "test2@test.com"
    }
];

// Create raw data to seed surveys
const surveys = [
    {
        title: "Test Survey 1",
        author: null,
        description: "A test survey",
        makePublic: true,
        introduction: "Please fill in this survey",
        completionMessage: "Thank you for responding",
        questions: {
            questionText: "Do you like this app?",
            questionType: "multipleChoice",
            questionOptions: ["Yes", "No", "Other"]
        } 
    },
    {
        title: "Test Survey 2",
        author: null,
        description: "A second test survey",
        makePublic: true,
        introduction: "Please fill in this survey",
        completionMessage: "Thank you for responding",
        questions: [
            {
                questionText: "Do you like this app?",
                questionType: "multipleChoice",
                questionOptions: ["Yes", "No", "Other"]
            },
            {
                questionText: "Tell us your thoughts",
                questionType: "shortText",
                questionOptions: []
            } 
        ] 
    }
]


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

databaseConnector(databaseURL).then(() => {
    console.log("Database connected successfully!");
})
.catch(error => {
    console.log(`
    An error occurred connecting to the database! Details: 
    ${error}
    `);
})
.then(async () => {
    if (process.env.WIPE == "true") {
        // Get the names of every collection in the db
        const collections = await mongoose.connection.db.listCollections().toArray();
        // Go through collections and delete all data in each one
        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            mongoose.connection.db.dropCollection(collectionName);
        });
        console.log("All old collections dropped from database.");
    }
})
.then(async () => {
    let createdUsers = await User.insertMany(users);
    console.log("Test user data inserted into database");
    for (let survey of surveys) {
        survey.author = createdUsers[1].id
    };
    await Survey.insertMany(surveys);
    console.log("Test surveys inserted into database")
}) // seed responses based off the seeded surveys.
.then(async() => {
    // Retrieve the two surveys seeded. 
    const survey1 = await Survey.findOne({title: "Test Survey 1"});
    const survey2 = await Survey.findOne({title: "Test Survey 2"});

    const responses = [
        {
            survey: survey1._id,
            answers: [
                {
                  question: survey1.questions[0]._id, // Question ID for "Do you like this app?"
                  answer: "Yes"
                },
              ]
        },
        {
            survey: survey1._id,
            answers: [
              {
                question: survey1.questions[0]._id, // Question ID for "Do you like this app?"
                answer: "No"
              },
            ]
          },
          {
            survey: survey2._id,
            answers: [
              {
                question: survey2.questions[0]._id, // Question ID for "Do you like this app?"
                answer: "Yes"
              },
              {
                question: survey2.questions[1]._id, // Question ID for "Tell us your thoughts"
                answer: "I like it"
              }
            ]
          },
          {
            survey: survey2._id,
            answers: [
              {
                question: survey2.questions[0]._id, // Question ID for "Do you like this app?"
                answer: "No"
              },
              {
                question: survey2.questions[1]._id, // Question ID for "Tell us your thoughts"
                answer: "I have some feedback"
              }
            ]
          }
        ];

        // save the responses to the database. 
        for (const response of responses) {
            const savedResponse = await Response.create(response);
            
            // Push the response ID to the survey's responses array
            const survey = await Survey.findById(savedResponse.survey);
            survey.responses.push(savedResponse._id);
            await survey.save();
            console.log("Test responses inserted in the database")
        }        
})
.then(() => {
    // Disconnect from the database.
    mongoose.connection.close();
    console.log("Database seed connection closed.")
});

// To seed database
//NODE_ENV=development node src/seeds.js

// To wipe and seed database
//NODE_ENV=development WIPE=true node src/seeds.js