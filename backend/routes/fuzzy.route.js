const express = require('express')
const fuzzyRoute = express.Router()
const jwt = require('jsonwebtoken')
const {
    Pool
} = require('pg')

const pool = new Pool({
    connectionString: process.env.MATCHMAKER_DATABASE_URL,
    ssl: true
})

const connectionString = process.env.MATCHMAKER_DATABASE_URL;

// Compatability Check
// Main endpoint: Should be the main endpoint needed for this particular section as it should reference the functions within this module
/* Return values:
    - id: string
    - name: string
    - compatabilityWithThem: float => checkTheirCompatability
    - compatabilityWithUser: float => checkUserCompatability
*/      
fuzzyRoute.route('compatability-check').get((req, res) => {
    // Get all users from DB in a list format excluding current JWT user
    // Loop over the users evaluating both checkUserCompatability and checkTheirCompatability
    /*
        let preferredGender = req.body.gender
        let minAge = req.body.minAge
        let maxAge = req.body.maxAge

        let usersCompatability = []

        let potentialMatches = getAcceptableUsers(preferredGender, minAge, maxAge)

        let jwtUser = getUser(JWT.user_id)

        for user : potentialMatches {
            let compat = new Object()
                    
            compat.id = user.user_id
            compat.name = user.fullname
            compat.compatabilityWithUser = checkUserCompatability(jwtUser, user)
            compat.compatabilityWithThem = checkTheirCompatability(jwtUser, user)

            usersCompatability.push(compat)
        }

        res.json(usersCompatability)
    */
})

// function getAcceptableUsers(preferredGender, minAge, maxAge) {}
// return: list of correpsonding users to loop over and check compatability with based on Gender, minAge, and maxAge
function getAcceptableUsers(preferredGender, minAge, maxAge) {
    /*
    const text = 'SELECT * FROM users WHERE complete == true AND user_id != $1 AND gender == $2 AND age >= $3 AND age <= $4'
    const values = [JWT.user_id, preferredGender, minAge, maxAge]
    try {
        let pgClient = await pool.connect()

        let users = await pgClient.query(text, values)
        pgClient.release()

        return users
    } catch (err) {
        console.log(err.message)
        return -1
    }
    */
}

function getUser(user_id) {
    /*
    const text = 'SELECT * FROM users WHERE user_id == $1'
    try {
        let pgClient = await pool.connect()

        let user = await pgClient.query(text, [user_id])
        pgClient.release()

        return user
    } catch (err) {
        console.log(err.message)
        return -1
    }
    */
}


// function checkUserCompatability(user) {}
// return : value corresponding to compatability of current JWT user against passed user
function checkUserCompatability(jwtUser, potentialMatch) {
    // Should pull passed user's acceptance criteria list
    // Check current JWT user answers against passed user's acceptance criteria
    /*
    let matchAcceptability = potentialMatch.acceptability_criteria
    let userAnswers = jwtUser.user_responses

    let proximities = []

    // gives a proximity list of values between 0 and 1 on a respective scale for each answer
    for (x = 0; x < matchAcceptability.length; x++) {
        proximities.push(generateProximity(matchAcceptability[x], userAnswers[x], 4))
    }

    // Should return a value between 0 and 1 corresponding to the compatability rating of the summation of all proximities
    // Scaled ot the number of questions that were asked and compared against
    // Closer the number is to 0, the worse the compatability rating
    let userCompatability = (1.00 - (proximities.reduce((a, b) => a + b, 0) / matchAcceptability.length))

    return userCompatability
    */
}


// function checkTheirCompatability(user) {}
// return : value corresponding to compability of passed user against current JWT user
function checkTheirCompatability(jwtUser, potentialMatch) {
    // Should pull passed user's question answers list
    // Check current passed user answers against current JWT user's acceptance criteria
    /*
    let userAcceptability = jwtUser.acceptability_criteria
    let matchAnswers = potentialMatch.user_responses

    let proximities = []

    // gives a proximity list of values between 0 and 1 on a respective scale for each answer
    for (x = 0; x < userAcceptability.length; x++) {
        proximities.push(generateProximity(userAcceptability[x], matchAnswers[x], 4))
    }

    // Should return a value between 0 and 1 corresponding to the compatability rating of the summation of all proximities
    // Scaled to the number of questions that were asked and compared against
    // Closer the number is to 1, the worse the compatability rating
    let theirCompability = (1.00 - (proximities.reduce((a, b) => a + b, 0) / userAcceptability.length))

    return theirCompatability
    */
}

// function generateProximity () {}
// return: Proximity closeness to corresponding answers
function generateProximity(userOneAns, userTwoAns, scale) {
    return (Math.abs(userOneAns - userTwoAns) / scale)
}

module.exports = fuzzyRoute