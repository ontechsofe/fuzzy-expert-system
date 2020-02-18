const express = require('express')
const userRoute = express.Router()


// New User
// Generate the New User into the Database
/*
    Return:
        - Success: Boolean 
*/



// Login
// Log the User into the System
/*
    Return:
        - JWT (With Expiry): String
        - Success: Boolean
*/



// Complete Profile
// Complete the Profile Questionnaire and Log Responses into the System
/*
    Return:
        - Success: Boolean
*/



// Get User Answers
// Should return the user's answers to the questions they filled out when completing their profile
/* 
    Return:
        - [{
            Question: int
            Response: int
            Acceptance: int
        }, ...]: 
*/




module.exports = userRoute