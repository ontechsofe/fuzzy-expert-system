const express = require('express')
const fuzzyRoute = express.Router()
const {
    Pool
} = require('pg')

const pool = new Pool({
    connectionString: process.env.MATCHMAKER_DATABASE_URL,
    ssl: true
})

// Compatibility Check
// Main endpoint: Should be the main endpoint needed for this particular section as it should reference the functions within this module
/* Return values:
    - id: string
    - name: string
    - compatibilityWithThem: float => checkTheirCompatibility
    - compatibilityWithUser: float => checkUserCompatibility
*/
fuzzyRoute.route('/compatibility-check').post((req, res) => {
    // Get all users from DB in a list format excluding current JWT user
    // Loop over the users evaluating both checkUserCompatibility and checkTheirCompatibility
    let preferredGender = req.body.gender
    let minAge = req.body.minAge
    let maxAge = req.body.maxAge
    let userId = req.body.userId
    
    let usersCompatibility = []

    getAcceptableUsers(userId, preferredGender, minAge, maxAge).then(potentialMatches => {        
        getUser(userId).then(jwtUser => {
            if (potentialMatches != -1 && jwtUser != -1 && potentialMatches.length > 0) {
                potentialMatches.forEach(user => {
                    let compat = new Object()
        
                    compat.userId = user.user_id
                    compat.name = user.fullname
                    compat.compatibilityWithUser = checkUserCompatibility(jwtUser, user)
                    compat.compatibilityWithThem = checkTheirCompatibility(jwtUser, user)
        
                    usersCompatibility.push(compat)
                })
        
                res.json({
                    data: usersCompatibility,
                    success: true
                })
            } else {
                res.json({
                    data: [],
                    success: false
                })
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

// function getAcceptableUsers(preferredGender, minAge, maxAge) {}
// return: list of correpsonding users to loop over and check compatibility with based on Gender, minAge, and maxAge
async function getAcceptableUsers(userId, preferredGender, minAge, maxAge) {
    const text = 'SELECT * FROM users WHERE complete = true AND user_id != $1 AND gender = $2 AND age >= $3 AND age <= $4'
    const values = [userId, preferredGender, minAge, maxAge]
    try {
        let pgClient = await pool.connect()

        let users = await pgClient.query(text, values)
        pgClient.release()
        return users.rows
    } catch (err) {
        console.log(err.message)
        return -1
    }
}

async function getUser(userId) {
    const text = 'SELECT * FROM users WHERE user_id = $1'
    try {
        let pgClient = await pool.connect()

        let user = await pgClient.query(text, [userId])
        pgClient.release()
        return user.rows[0]
    } catch (err) {
        console.log(err.message)
        return -1
    }
}


// function checkUserCompatibility(user) {}
// return : value corresponding to compatibility of current JWT user against passed user
function checkUserCompatibility(jwtUser, potentialMatch) {
    // Should pull passed user's acceptance criteria list
    // Check current JWT user answers against passed user's acceptance criteria
    let matchAcceptability = potentialMatch.acceptability_criteria.split(',')
    let userAnswers = jwtUser.user_responses.split(',')

    let proximities = []

    // Gives a proximity list of values between 0 and 1 on a respective scale for each answer
    for (x = 0; x < matchAcceptability.length; x++) {
        proximities.push(generateProximity(matchAcceptability[x], userAnswers[x], 4))
    }

    // Should return a value between 0 and 1 corresponding to the compatibility rating of the summation of all proximities
    // Scaled to the number of questions that were asked and compared against
    // Closer the number is to 0, the worse the compatibility rating
    let userCompatibility = (1.00 - (proximities.reduce((a, b) => a + b, 0) / matchAcceptability.length))

    return userCompatibility
}


// function checkTheirCompatibility(user) {}
// return : value corresponding to compability of passed user against current JWT user
function checkTheirCompatibility(jwtUser, potentialMatch) {
    // Should pull passed user's question answers list
    // Check current passed user answers against current JWT user's acceptance criteria
    let userAcceptability = jwtUser.acceptability_criteria.split(',')
    let matchAnswers = potentialMatch.user_responses.split(',')

    let proximities = []
    
    // Gives a proximity list of values between 0 and 1 on a respective scale for each answer
    for (x = 0; x < userAcceptability.length; x++) {
        proximities.push(generateProximity(userAcceptability[x], matchAnswers[x], 4))
    }

    // Should return a value between 0 and 1 corresponding to the compatibility rating of the summation of all proximities
    // Scaled to the number of questions that were asked and compared against
    // Closer the number is to 1, the worse the compatibility rating
    let theirCompatibility = (1.00 - (proximities.reduce((a, b) => a + b, 0) / userAcceptability.length))

    return theirCompatibility
}

// function generateProximity () {}
// return: Proximity closeness to corresponding answers
function generateProximity(userOneAns, userTwoAns, scale) {
    return (Math.abs(userOneAns - userTwoAns) / scale)
}

module.exports = fuzzyRoute