var express = require('express');
var router = express.Router();
const expressValidator = require('express-validator');
const { body } = require('express-validator/check');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const bcrypt = require('bcryptjs');
const User = require('../Models/User/User');
const Invoice = require('../Models/invoice/invoice');
let multer = require('multer');
let storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
}).single('profileimage');

let passport = require('passport');

//custom validator
router.use(expressValidator({
  customValidators: {
    isImage: function (value, filename) {

      if (filename == undefined) {
        return false;
      }
      else {
        return true;
      }
    }
  }
}));


/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });

//Home Page User Login
router.get('/', (req, res) => {
  res.render('login');
});

//Route for User registration page
router.get('/register', (req, res) => {
  res.render('register');
});

//Route if User got registered Successfully
router.get('/success', (req, res) => {
  res.render('success');
});

//Route if User successfully logged in
router.get('/login/invoice', (req, res) => {
  res.render('invoice', {
    nameBus: req.user.username
  });
});

router.get('/login/peviewInv', (req, res) => {
  res.render('previewInv');
});

//User Logout 
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

//Route if Login Fails
router.get('/loginfail', (req, res) => {
  res.render('loginfail');
});

//Route for User Registration
router.post('/register', upload, async (req, res, next) => {

  req.checkBody('fname', 'Enter Firstname').notEmpty();
  req.checkBody('lname', 'Enter Lastname').notEmpty();
  req.checkBody('email', 'Enter email').isEmail();
  req.checkBody('phone', 'Enter a valid Phonenumber').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('rppassword', 'Password is not matching').equals(req.body.password);

  //restLogo = typeof req.files[req.body.profileimage] !== "undefined" ? req.files[req.body.profileimage][0].filename : '';

  req.checkBody('profileimage', 'Please upload a file').isImage(req.file);





  const errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
    })
  } else {
    let newUser = new User(req.body);
    let data = await User.findOne({
      email: req.body.email
    });

    if (data) return res.status(400).send('User Already Registered');
    let token = randomstring.generate();
    newUser.token = token;
    newUser.profileimage = req.file.originalname;

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt)

    await newUser.save(function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Data Saved in Database");
      }
    });

    //  sending email from gmail using nodemailer

    let transporter = nodemailer.createTransport({

      host: 'gains.arrowsupercloud.com',
      port: 465,
      secure: true,
      auth: {
        user: "nishmara@nishnomadcoder.me",
        pass: 'd[dhKchmOh-o',
      }
    });

    let mailOptions = {
      from: '"Nishanth Maraboina" <nishmara@nishnomadcoder.me>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Hello your registration is Successful', // Subject line
      text: 'Hello world', // plain text body
      html: ` <h1>Hello <b>${newUser.fname}</b></h1>. <p>Please <a href="https://nishinvoiceapp.herokuapp.com/verify/${newUser.token}">Click here</a> for activating your account</p>` // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ' + info.response);
        req.flash('success', 'User Successfully Logged In');
        res.redirect('/success');
      }
    });
  }
});

//Route for User login

router.post('/', async (req, res, next) => {

  let result = await User.findOne({
    email: req.body.email
  });

  if (!result) {
    req.flash('danger', 'Username is Invalid');
    res.redirect('/');
  }

  const valid = await bcrypt.compare(req.body.password, result.password);
  if (!valid) {
    req.flash('danger', 'Password is incorrect');
    res.redirect('/');
  } else {
    var username = `${result.fname}  ${result.lname}`;
    var email = result.email;
    var phone = result.phone;
    res.render('invoice', {
      user: username,
      email: email,
    });
  }
});

router.get('/verify/:tid', function (req, res) {
  // if(req.body.email == )

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

router.post('/login/invoice/data', async (req, res) => {

  req.checkBody('emailBus', 'Enter Business Email').notEmpty();
  req.checkBody('emailCli', 'Enter Client Email').notEmpty();
  req.checkBody('nameBus', 'Enter Business Name').notEmpty();
  req.checkBody('nameCli', 'Enter Client Name').notEmpty();
  req.checkBody('addressBus', 'Business Address').notEmpty();
  req.checkBody('addressCli', 'Business Address').notEmpty();


  const errors = req.validationErrors();
  if (errors) {
    res.render('invoice', {
      title: "Invoice Form",
      errors: errors,
    })
  } else {
    let newInvoice = new Invoice(req.body);
    await newInvoice.save(function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Invoice Data Saved in Database");
      }
    });

    let transporter = nodemailer.createTransport({

      host: 'gains.arrowsupercloud.com',
      port: 465,
      secure: true,
      auth: {
        user: "nishmara@nishnomadcoder.me",
        pass: 'd[dhKchmOh-o',
      }
    });

    let mailOptions = {
      from: '"Nishanth Maraboina" <nishmara@nishnomadcoder.me>', // sender address
      to: [newInvoice.emailBus, newInvoice.emailCli], // list of receivers
      subject: 'Hello your Invoice is generated', // Subject line
      text: 'Hello world', // plain text body
      html: ` <h1>Hello <b>${newInvoice.nameBus}</b></h1>. <p>Please find the invoice details below</p>
          <table border="2" style="border-collapse:collapse">
            <thead>
              <th>Business Name</th>
              <th>Business Email</th>
              <th>Business Address</th>
              <th>Business Phone</th>
              <th>Client Name</th>
              <th>Client Email</th>
              <th>Client Address</th>
              <th>Client Phone</th>
              <th>Invoice Number</th>
              <th>Invoice Date</th>
              <th>Item Description</th>
              <th>Invoice Total
            </thead>
            <tbody>
              <tr>
                  <td style="text-align:center;">${newInvoice.nameBus}</td>
                  <td style="text-align:center;">${newInvoice.emailBus}</td>
                  <td style="text-align:center;">${newInvoice.addressBus}</td>
                  <td style="text-align:center;">${newInvoice.numBus}</td>
                  <td style="text-align:center;">${newInvoice.nameCli}</td>
                  <td style="text-align:center;">${newInvoice.emailCli}</td>
                  <td style="text-align:center;">${newInvoice.addressCli}</td>
                  <td style="text-align:center;">${newInvoice.numCli}</td>
                  <td style="text-align:center;">${newInvoice.invNum}</td>
                  <td style="text-align:center;">${newInvoice.invDate}</td> 
                  <td style="text-align:center;">${newInvoice.itemDes}</td>
                  <td style="text-align:center;">${newInvoice.total}</td>
              </tr>
            </tbody>
          </table>    ` // html body

    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ' + info.response);
        res.render('invoicegen');
      }
    });
  }
});

//Google Sign in route

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'],
}));

router.get('/auth/google/redirect', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  console.log(req.user);
  var username = req.user.username;
  var email = req.user.emailId;
  res.render('invoice', {
    user: username,
    email: email
  });
});

//linkedin Sign in Route

router.get('/auth/linkedin', passport.authenticate('linkedin', {
  scope: ['r_basicprofile', 'r_emailaddress']
}));

router.get('/auth/linkedin/redirect', passport.authenticate('linkedin', {
  failureRedirect: '/'
}), (req, res) => {
  var username = req.user.username;
  var email = req.user.emailId;
  res.render('invoice', {
    user: username,
    email: email
  });
});

//Twitter Sign in Route

router.get('/auth/twitter', passport.authenticate('twitter', {
  scope: ['profile']
}));

router.get('/auth/twitter/redirect', passport.authenticate('twitter', {
  failureRedirect: '/'
}), (req, res) => {
  var username = req.user.username;
  var email = req.user.emailId;
  res.render('invoice', {
    user: username,
    email: email
  })
})


module.exports = router;