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
                userId: user.user_id,
                name: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
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
        let userId = req.body.userId
        let religion1 = req.body.answers.Religion[0]
        let religion2 = req.body.answers.Religion[1]
        let education1 = req.body.answers.Education[0]
        let education2 = req.body.answers.Education[1]
        let smoking1 = req.body.answers.Smoking[0]
        let smoking2 = req.body.answers.Smoking[1]
        let drinking1 = req.body.answers.Drinking[0]
        let drinking2 = req.body.answers.Drinking[1]
        let activity1 = req.body.answers.Activity[0]
        let activity2 = req.body.answers.Activity[1]
        let social1 = req.body.answers.Social[0]
        let social2 = req.body.answers.Social[1]
        let user_responses = religion1 + "," + education1 + "," + smoking1 + "," + drinking1 + "," + activity1 + "," + social1
        let acceptability_criteria = religion2 + "," + education2 + "," + smoking2 + "," + drinking2 + "," + activity2 + "," + social2
        const client = await pool.connect()
        let sql = `UPDATE users SET complete = $1, user_responses = $2, acceptability_criteria = $3 WHERE user_id = $4`
        let values = [true, user_responses, acceptability_criteria, userId]
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
    Sent: userId

    Return: True or False:

*/
userRoute.route('/check').post(async (req,res) =>{
    try{
        let userId = req.body.userId
        const client = await pool.connect()
        let sql = `SELECT * FROM users WHERE user_id = $1`
        let values = [userId]
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
                data: {
                complete: false
                },
                success: true
            })
        }
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})
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
userRoute.route('/get-answers').get(async (req,res) => {
    try{
        let userId = req.body.userId
        const client = await pool.connect()
        let sql = `SELECT user_responses, acceptability_criteria FROM users WHERE user_id = $1`
        let values = [userId]
        const result = await client.query(sql, values)
        let user_responses = result.rows[0].user_responses
        let acceptability_criteria = result.rows[0].acceptability_criteria
        if (user_responses != null && acceptability_criteria != null){
            let response_list = user_responses.split(',').map(Number)
            let acceptability_list = acceptability_criteria.split(',').map(Number)
            let answers_list = []
            for(i = 0; i < response_list.length; i++){
                let ans = new Object()
                ans.Question = i
                ans.Response = response_list[i]
                ans.Acceptance = acceptability_list[i]
                answers_list.push(ans)
            }
            res.json({
                data: answers_list,
                success: true
            })
        } else {
            res.json({
                success: true
            })
        }
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})





module.exports = userRoute