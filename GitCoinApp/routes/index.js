var express = require('express');
var router = express.Router();
let passport = require('passport');
const OAuthUsers = require('../Models/oauth/user-model');
const nodemailer = require('nodemailer');
const isLoggedIn = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        // res.redirect('/login');
        res.send('Please Login!')
    }

}
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('LoginPage');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/github', passport.authenticate('github', {
    scope: ['user'],
}));

router.get('/auth/github/redirect', passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: '/profile'
}), (req, res) => {


});

router.get('/profile', isLoggedIn, (req, res) => {

    let updatedUser = req.user;
    res.render('LandingPage', {
        user: updatedUser.displayName,
        profileName: updatedUser.username,
        followers: updatedUser.followers,
        following: updatedUser.following,
        displayImage: updatedUser.displayImage,
        profileUrl: updatedUser.profileUrl,
        total: updatedUser.total,
        balance: updatedUser.balance,
        lastCommit: updatedUser.lastCommit,
        dataDebits: JSON.stringify(updatedUser.gitDebits),
        dataSummary: JSON.stringify(updatedUser.gitDebits.concat(updatedUser.contributions)),
        dataJSON: JSON.stringify(updatedUser.contributions),
    });
});

router.post('/profile', (req, res) => {

    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    console.log(req.body.redeemItem);
    let redeemCoins = parseInt(req.body.redeemCoins);
    let redeemItem = req.body.redeemItem;

    //For redeemItems array

    let redeemItemsArr = req.user.redeemItems;
    redeemItemsArr.push(redeemItem);

    //For redeemcoins array
    let redeemCoinsArr = req.user.redeemCoins;
    redeemCoinsArr.push(redeemCoins);

    //for gitdebits array
    let debitCoins = '-' + redeemCoins;
    // let purchasedItem = req.body.purchasedItem;
    let gitDebits = req.user.gitDebits;
    gitDebits.unshift({ date: dateString, coins: debitCoins });

    //For Balance Coins
    let remBalance = 0;
    remBalance = remBalance + (req.user.balance - redeemCoins);

    //Save the details in database after redeem

    OAuthUsers.findByIdAndUpdate(req.user._id, {
        gitDebits: gitDebits,
        balance: remBalance,
        redeemCoins: redeemCoinsArr,
        redeemItems: redeemItemsArr
    }, (err) => {
        if (err) throw err;
        console.log('Data Saved in DataBase');
        res.redirect('/profile');
    })

    //  sending email notification using nodemailer

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
        to: [req.user.emailId, '"Nishanth Maraboina" <nishmara@nishnomadcoder.me>'],// list of receivers
        subject: 'Your Redeem is Successful with GitCoin Application', // Subject line
        text: 'Hello world', // plain text body
        html: ` <h1>Hello <b>${req.user.displayName}</b></h1>. <p>Please find the details of your redeem below</p>
        <table border="2" style="border-collapse:collapse">
          <thead>
            <th>Date</th>
            <th>You Wished For</th>
            <th>Coins Used</th>
            <th>Username</th>
            <th>Contributions</th>
            <th>Balance Coins</th>
          </thead>
          <tbody>
            <tr>
                <td style="text-align:center;">${dateString}</td>
                <td style="text-align:center;">${redeemItem}</td>
                <td style="text-align:center;">${redeemCoins}</td>
                <td style="text-align:center;">${req.user.username}</td>
                <td style="text-align:center;">${req.user.total}</td>
                <td style="text-align:center;">${remBalance}</td>
            </tr>
          </tbody>
        </table>
        <div>
            <br />
        </div>
        <h5>Best Regards</h5>    
        <table style="border-collapse:collapse;color:rgb(51,51,51);letter-spacing:0.14px;font-family:"Courier New";font-size:12.6px">
            <tbody>
                <tr>
                    <td valign="top" style="padding:0px 8px 0px 0px">
                        <img src='https://thehackingschool.com/images/ths-trans.png' width='96' height='54'/>
                    </td>
                    <td valign="middle" style="padding:0px 0px 0px 8px;border-left:3px solid rgb(11,12,103);border-top-color:rgb(11,12,103);border-right-color:rgb(11,12,103);border-bottom-color:rgb(11,12,103)">
                        <div><font face="trebuchet ms, sans-serif"><b><font color="#000000">Nishanth Maraboina</font></b><span></span></font></div>
                        <font face="trebuchet ms, sans-serif">Full Stack Developer&nbsp;| The Hacking School</font>
                        <div><span><font face="trebuchet ms, sans-serif"><span style="color:rgb(11,12,103)">Mobile:&nbsp;</span>&nbsp;<span>8106726646&nbsp;</span></font></span></div>
                        <div><span style="font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:12.6px;letter-spacing:0.14px;color:rgb(11,12,103)">e:&nbsp;<a href="http://goog_921222138" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://goog_921222138&amp;source=gmail&amp;ust=1549717789041000&amp;usg=AFQjCNG_qOge4abiodEhx3qxyzgpC0nWLw">nishanthmaraboina</a></span><span style="font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:12.6px;letter-spacing:0.14px"><a href="mailto:nishanthmaraboina@gmail.com" target="_blank">@gmail.com&nbsp;</a></span></div>
                    </td>
                </tr>
            </tbody>
        </table>` // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
            req.flash('success', 'Your Reddem is Successful!! Keep Your Contribution Streak On to Gain More..');
            res.redirect('/profile');
        }
    });


});




module.exports = router;
