const mongoose = require('mongoose');
const { databaseConnector } = require('./database');

// Import models to be seeded
const {User} = require('./models/userModel');
const {Survey} = require('./models/surveyModel');

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
    console.log("Test user data inserted into db");
    for (let survey of surveys) {
        survey.author = createdUsers[1].id
    };
    await Survey.insertMany(surveys);
    console.log("Test surveys inserted into database")
})
.then(() => {
    // Disconnect from the database.
    mongoose.connection.close();
    console.log("DB seed connection closed.")
});

// To seed database
//NODE_ENV=development node src/seeds.js

// To wipe and seed database
//NODE_ENV=development WIPE=true node src/seeds.js