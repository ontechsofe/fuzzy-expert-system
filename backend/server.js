const express = require('express')
var path = require('path')
var bodyParser = require('body-parser')

const port = process.env.PORT || 8080;


const fuzzyRoute = require("./routes/fuzzy.route.js")
const userRoute = require("./routes/user.route.js")
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use('/api/fuzzy-route', fuzzyRoute)
app.use('/api/user', userRoute)

/* For Launch:
app.use(express.static(path.join(__dirname, '../dist/personal-website/')))
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../dist/personal-website/index.html'))
})
*/

var server = app.listen(port, () => {
    var serverPort = server.address().port;
    console.log(`Server started on port ${serverPort}`)
}) 