const express = require('express')
const fuzzyRoute = express.Router()

// Compatability Check
// Main endpoint: Should be the main endpoint needed for this particular section as it should reference the functions within this module
/* Return values:
    - id: string
    - name: string
    - compatabilityWithThem: float
    - compatabilityWithUser: float
*/      
fuzzyRoute.route('compatability-check').get((req, res) => {

})




// function checkUserCompatability(user) {}
// return : value corresponding to compatability of current JWT user against passed user
function checkUserCompatability(user) {

}


// function checkTheirCompatability(user) {}
// return : value corresponding to compability of passed user against current JWT user
function checkTheirCompatability(user) {

}


// function generateScale() {}
// return : 



module.exports = fuzzyRoute