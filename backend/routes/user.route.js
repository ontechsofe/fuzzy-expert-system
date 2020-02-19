const express = require('express')
const userRoute = express.Router()
const jwt = require('jsonwebtoken');
const base64 = require('base64url');
const crypto = require('crypto');
const fs = require('fs');
const env = require('dotenv/config');
const {
    Pool
} = require('pg');
const pool = new Pool({
    connectionString: process.env.MATCHMAKER_DATABASE_URL,
    ssl: true
})
// New User
// Generate the New User into the Database
userRoute.route('/create-user').post(async (req,res) => {
    try{
        //User Information from request body
        let username = req.body.username;
        let password = req.body.password;
        let fullname = req.body.fullname;
        let age = req.body.age;
        let gender = req.body.gender;
        
        //DB Connection
        const client = await pool.connect()
        //DB Querying
        let sql = `INSERT INTO users (username, password, fullname, age, gender) VALUES ($1, $2, $3, $4, $5)`;
        let values = [username, password, fullname, age, gender];
        const result = await client.query(sql, values);
        //Close DB Connection
        client.release()
        //JSON response
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
    try{   
        let username = req.body.username;
        let password = req.body.password;

        const client = await pool.connect()
        let sql = `SELECT * FROM users WHERE username = $1 AND password = $2`;
        let values = [username, password];
        const result = await client.query(sql, values);
        client.release();
        if (result.rowCount == 1){
            const user = result.rows[0];
            const payload = {
                name: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' })
            res.json({
                data: {
                    accessToken: accessToken
                },
                success: true
            });
        } else {
            console.log("Invalid Login Credentials")
            res.json({
                success: false
            })
        }
        
    } catch(err){
        console.log(err.message)
        res.json({  
            success: false
        })
    }
})
// Complete Profile
// Complete the Profile Questionnaire and Log Responses into the System
/*
    Return:
        - Success: Boolean
*/
userRoute.route('/complete').post(async (req,res) => {
    try{
        let user_id = req.body.user_id
        let user_responses = req.body.user_responses
        let acceptibility_criteria = req.body.acceptibility_criteria
        const client = await pool.connect()
        let sql = `UPDATE users SET complete = $1, user_responses = $2, acceptibility_criteria = $3 WHERE user_id = $4`
        let values = [true, user_responses, acceptibility_criteria, user_id]
        const result = await client.query(sql, values)
        res.json({
            success: true
        })
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})
/*
    Sent: user_id

    Return: True or False:

*/
userRoute.route('/check').post(async (req,res) =>{
    try{
        let user_id = req.body.user_id
        const client = await pool.connect()
        let sql = `SELECT * FROM users WHERE user_id = $1`
        let values = [user_id]
        const result = await client.query(sql, values)
        let accCompletion = result.rows[0].complete
        if (accCompletion == true){
            res.json({
                data: {
                    complete: accCompletion
                },
                success: true
            })
        } else {
            res.json({
                success: false
            })
        }
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})
//CHECK IF COMPLETE ENDPOINT

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