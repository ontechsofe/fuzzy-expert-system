const express = require('express')
const fuzzyRoute = express.Router()
const pg = require('pg')
// Compatability Check
// Main endpoint: Should be the main endpoint needed for this particular section as it should reference the functions within this module
/* Return values:
    - id: string
    - name: string
    - compatabilityWithThem: float => checkTheirCompatability
    - compatabilityWithUser: float => checkUserCompatability
*/      
fuzzyRoute.route('compatability-check').get((req, res) => {

})


// function checkUserCompatability(user) {}
// return : value corresponding to compatability of current JWT user against passed user
function checkUserCompatability(user) {
    // Should pull passed user's acceptance criteria list
    // Check current JWT user answers against passed user's acceptance criteria

}


// function checkTheirCompatability(user) {}
// return : value corresponding to compability of passed user against current JWT user
function checkTheirCompatability(user) {
    // Should pull passed user's question answers list
    // Check current passed user answers against current JWT user's acceptance criteria

}


// function generateScale() {}
// return : 


// function generateProximity () {}
// return: Proximity closeness to corresponding answers
function generateProximity(userOneAns, userTwoAns, scale) {
    return (Math.abs(userOneAns - userTwoAns) / scale)
}

module.exports = fuzzyRoute