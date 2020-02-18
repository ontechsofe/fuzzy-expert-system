const express = require('express')
const userRoute = express.Router()
const pg = require('pg')
const jwt = require('jsonwebtoken');

const connectionString = process.env.MATCHMAKER_DATABASE_URL;
// New User
// Generate the New User into the Database
userRoute.route('/create-user').post(async (req,res) => {
    try{
        let username = req.body.username;
        let password = req.body.password;
        let fullname = req.body.fullname;
        let age = req.body.age;
        let gender = req.body.gender;
        
        let pgClient = new pg.Client(connectionString);
        pgClient.connect();
        let sql = `INSERT INTO users (username, password, fullname, age, gender) VALUES ($1, $2, $3, $4, $5)`;
        let values = [username, password, fullname, age, gender];
        const result = await pgClient.query(sql, values);
        pgClient.end();
        res.json({
            success: true
        });
    } catch(err){
        console.log(err.message);
        res.json({
            success: false
        });
    }
});

// Login
// Log the User into the System
userRoute.route('/login').post(async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let pgClient = new pg.Client(connectionString);
})
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