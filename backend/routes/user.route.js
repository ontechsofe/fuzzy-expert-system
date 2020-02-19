/**
 * Routes for User account
 */
// import required packages
const express = require('express')
const userRoute = express.Router()
const jwt = require('jsonwebtoken');
const base64 = require('base64url');
const crypto = require('crypto');
const fs = require('fs');
const env = require('dotenv/config');
//Setup database pool
const {
    Pool
} = require('pg');
const pool = new Pool({
    connectionString: process.env.MATCHMAKER_DATABASE_URL,
    ssl: true
})
/**
 * New User Endpoint
 * Parameters: username, password, fullname, age, gender
 * Returns: Success
 */
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

/**
 * Login Endpoint
 * Parameters: username, password
 * Returns: accessToken, JWT
 */
userRoute.route('/login').post(async (req,res) => {
    try{
        //User information from request body
        let username = req.body.username;
        let password = req.body.password;
        //DB Connection
        const client = await pool.connect()
        //DB Querying
        let sql = `SELECT * FROM users WHERE username = $1 AND password = $2`;
        let values = [username, password];
        const result = await client.query(sql, values);
        //Release DB connection
        client.release();
        //Check if the user exists in the database
        if (result.rowCount == 1){
            const user = result.rows[0];
            //Place the user information into the payload of the JWT
            const payload = {
                userId: user.user_id,
                name: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender
            }
            //sign the jwt with the secret and set the expiry
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            //JSON response
            res.json({
                data: {
                    accessToken: accessToken
                },
                success: true
            });
        }
        //If no user matches the credentials, return false 
        else {
            console.log("Invalid Login Credentials")
            res.json({
                success: false
            })
        }
    //Catch any errors and return false
    } catch(err){
        console.log(err.message)
        res.json({  
            success: false
        })
    }
})
/**
 * Complete User Profile Endpoint
 * Description: For a user to be able to match with other users, they must first answer a short questionnaire to determine their personality.
 *  Once the questionnaire has been answered, add their responses and set the user value complete to true
 * Parameters: userId, Answers to the questionnaire
 * Returns: Success
 */
userRoute.route('/complete').post(async (req,res) => {
    try{
        //Get ALL the responses from body of the request
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
        //Group all responses into their corresponding String
        let user_responses = religion1 + "," + education1 + "," + smoking1 + "," + drinking1 + "," + activity1 + "," + social1
        let acceptability_criteria = religion2 + "," + education2 + "," + smoking2 + "," + drinking2 + "," + activity2 + "," + social2
        //DB Connection
        const client = await pool.connect()
        let sql = `UPDATE users SET complete = $1, user_responses = $2, acceptability_criteria = $3 WHERE user_id = $4`
        let values = [true, user_responses, acceptability_criteria, userId]
        const result = await client.query(sql, values)
        //release DB connection
        client.release()
        res.json({
            success: true
        })
        //Catch any Errors
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})

/**
 * Check if User Creation Complete Endpoint
 * Parameters: userId
 * Returns: Completion Status, Success
 */
userRoute.route('/check').post(async (req,res) =>{
    try{
        //Get information for request body
        let userId = req.body.userId
        //DB Connection
        const client = await pool.connect()
        //DB Querying
        let sql = `SELECT * FROM users WHERE user_id = $1`
        let values = [userId]
        const result = await client.query(sql, values)
        //Release the client
        client.release()
        //Set accCompletion to the complete value of the specific user
        let accCompletion = result.rows[0].complete
        if (accCompletion == true){
            //JSON response
            res.json({
                data: {
                    complete: accCompletion
                },
                success: true
            })
        }
        //JSON response if the account is not complete
        else {
            res.json({
                data: {
                complete: false
                },
                success: true
            })
        }
        //catch errors
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})
/**
 * Get Answers Endpoint
 * Parameters: userId
 * Returns: Success, answers_list
 */
userRoute.route('/get-answers').get(async (req,res) => {
    try{
        //information from request body
        let userId = req.body.userId
        //DB Connection
        const client = await pool.connect()
        //DB Querying
        let sql = `SELECT user_responses, acceptability_criteria FROM users WHERE user_id = $1`
        let values = [userId]
        const result = await client.query(sql, values)
        //Release DB Connection
        client.release()
        //Get user_responses and acceptability_criteria
        let user_responses = result.rows[0].user_responses
        let acceptability_criteria = result.rows[0].acceptability_criteria
        //Check if the two fields are not null
        if (user_responses != null && acceptability_criteria != null){
            //Parse the String into an array
            let response_list = user_responses.split(',').map(Number)
            let acceptability_list = acceptability_criteria.split(',').map(Number)
            //Initialize an answers list array
            let answers_list = []
            //Loop through the lists
            for(i = 0; i < response_list.length; i++){
                //Create ans object that contains question number, response, and acceptability
                let ans = new Object()
                ans.Question = i
                ans.Response = response_list[i]
                ans.Acceptance = acceptability_list[i]
                //push ans to answers list
                answers_list.push(ans)
            }
            //JSON response
            res.json({
                data: answers_list,
                success: true
            })
            //JSON response if response_list or user_list does not exist
        } else {
            res.json({
                success: true
            })
        }
        //Catch error
    } catch(err){
        console.log(err.message)
        res.json({
            success: false
        })
    }
})





module.exports = userRoute