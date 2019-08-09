let createError = require('http-errors');
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require("body-parser");
let flash = require('connect-flash');
let session = require('express-session');
let passport = require('passport');
const bcrypt = require('bcryptjs');
let db = require('./dbConnect');
let passportSetup = require('./config/passport');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const expressValidator = require('express-validator');




let app = express();



let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]

}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//Express Sessions Middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Express Messages Middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Passport authentication System

app.use(passport.initialize());
app.use(passport.session());

//app.use('/', indexRouter);

app.use('/', usersRouter);
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())



app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;