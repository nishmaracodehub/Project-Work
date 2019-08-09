var express = require('express')
var app = express()
const bcrypt = require('bcryptjs');

app.get('/', function (req, res) {
    res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage')
})

