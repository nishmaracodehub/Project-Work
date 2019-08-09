var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
const session = require('express-session');
var logger = require('morgan');
let passportSetup = require('./config/passport');
let passport = require('passport');
const keys = require('./config/keys');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let flash = require('connect-flash');

var app = express();

//database conn

require('./dbConnect');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

//Passport authentication System

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
