//Modules Used
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./dbConnect');
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');
const randomstring = require('randomstring');
const bcrypt = require('bcryptjs');
const OAuth2 = require('oauth2');

//Models Used
const User = require('./Models/User/User');


//assigning port to the server
const port = process.env.PORT || 1212;

//set public folder as static
//app.set(express.static(path.join(__dirname, 'Public')));

//set view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'Public'));

//setting bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//using express validator
app.use(expressValidator());

//Home Page User Login
app.get('/', (req, res) => {
    res.render('views/login');
});

//Route for User registration page
app.get('/register', (req, res) => {
    res.render('views/register');
});

//Route if User got registered Successfully
app.get('/success', (req, res) => {
    res.render('views/success');
});

//Route if User successfully logged in
app.get('/loggedin', (req, res) => {
    res.render('views/loggedin');
});

//Route if Login Fails
app.get('/loginfail', (req, res) => {
    res.render('views/loginfail');
});

//Route for User Registration

app.post('/register/user', async (req, res, next) => {
    req.checkBody('email', 'Enter email').isEmail();
    req.checkBody('fname', 'Enter Firstname').notEmpty().isAlphanumeric().len(3, 20);
    req.checkBody('lname', 'Enter Lastname').notEmpty().isAlphanumeric().len(3, 20);
    req.checkBody('phone', 'Enter a valid Phonenumber').notEmpty().isMobilePhone("en-IN");
    req.checkBody('password', 'Password is required').notEmpty().contains("@");
    req.checkBody('rppassword', 'Password is not matching').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        res.json(errors);
    }
    let newUser = new User(req.body);

    let data = await User.findOne({
        email: req.body.email
    });
    if (data) return res.status(400).send('User Already Registered');
    let token = randomstring.generate();
    newUser.token = token;

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt)
    await newUser.save(function (err) {
        if (err) {
            throw err;
        } else {
            console.log("Data Saved in Database");
        }
    });


    //sending email from gmail using nodemailer

    let transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: "nishanthmaraboina@gmail.com",
            accessToken: 'ya29.Glt8Bgsf5L5UzEPK0Z9u2LA60Tgxi9SFYxx3PFCEeWM6PpHQLzeCcK0WBLyJzMlk-pjnnNqjVSl__k_ha9_-zwYLM6yYeTs-kZHMGGYoBu2QgroRQR_ZpOGkdXmV',
        }
    });

    let mailOptions = {
        from: '"Nishanth Maraboina" <nishanthmaraboina@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Hello your registration is Successful', // Subject line
        text: 'Hello world', // plain text body
        html: ` <h1>Hello <b>${newUser.fname}</b></h1>. <p>Please <a href="https://nishnomad.herokuapp.com/verify/${newUser.token}">Click here</a> for activating your account</p>` // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/success');
        }
    });
});

//Route for User login

app.post('/login', async (req, res, next) => {

    let result = await User.findOne({
        email: req.body.email
    });

    if (!result) {
        res.redirect('/register');
    }

    const valid = await bcrypt.compare(req.body.password, result.password);
    if (!valid) {
        res.redirect('/loggedfail');
    } else {
        res.redirect('/loggedin');
    }
});



app.get('/verify/:tid', function (req, res) {
    User.findOneAndUpdate({
        token: req.params.tid
    }, {
        $set: {
            active: true
        }
    }, function (err, info) {
        if (err) res.json({
            Status: "Not Found"
        });
        else res.redirect('/');
    });
});

app.listen(port, (err) => {
    if (err) throw err;
    else {
        console.log(`Server is running on port ${port}`);
    }
});