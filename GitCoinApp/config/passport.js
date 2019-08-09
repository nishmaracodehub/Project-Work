const passport = require('passport');
const keys = require('./keys');
const OAuthUsers = require('../Models/oauth/user-model');
const GithubStrategy = require('passport-github');
const fetchStats = require('github-contribution-stats').fetchStats;


//serializing User

passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserialize User

passport.deserializeUser((id, done) => {
    OAuthUsers.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GithubStrategy({
    //options for google strategy
    callbackURL: '/auth/github/redirect',
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
}, (accessToken, refreshToken, profile, done) => {
    //check is user already exist in the database
    // console.log(profile);
    OAuthUsers.findOne({
        githubId: profile.id
    }).then((currentUser) => {
        if (currentUser) {
            let commitsArray = [], redeemSum = 0, balTotal = 0;
            fetchStats(currentUser.username)
                .then(stats => {
                    stats.contributions.forEach((date) => {
                        if (date.count != 0) {
                            date.coins = date.count;
                            delete date.count;
                            date.coins = date.coins / 10;
                            commitsArray.push(date);
                        }
                    })
                    let redeemCoinArr = currentUser.redeemCoins;
                    redeemSum = redeemSum + redeemCoinArr.reduce((tot, num) => tot + num, 0);
                    balTotal = balTotal + (Math.floor(stats.summary.total / 10) - redeemSum);
                    OAuthUsers.findByIdAndUpdate(currentUser._id, {
                        contributions: commitsArray.reverse(),
                        total: stats.summary.total,
                        balance: balTotal,
                        lastCommit: commitsArray[0].date
                    }).then((updatedUser) => {
                        console.log("User is:", updatedUser)
                        done(null, currentUser)
                    })
                })
        }
        //User is already in database
        else {
            //if not create user in database
            let commitsArray = [];
            fetchStats(profile.username)
                .then(stats => {
                    stats.contributions.forEach((date) => {
                        if (date.count != 0) {
                            date.coins = date.count;
                            delete date.count;
                            date.coins = date.coins / 10;
                            commitsArray.push(date);
                        }
                    })

                    new OAuthUsers({
                        username: profile.username,
                        displayName: profile.displayName,
                        githubId: profile.id,
                        emailId: profile.emails[0].value,
                        followers: profile._json.followers,
                        following: profile._json.following,
                        displayImage: profile.photos[0].value,
                        profileUrl: profile.profileUrl,
                        contributions: commitsArray.reverse(),
                        total: stats.summary.total,
                        balance: Math.floor(stats.summary.total / 10),
                        lastCommit: commitsArray[0].date
                    }).save().then((newOAuthUser) => {
                        console.log("New User is:", newOAuthUser)
                        done(null, newOAuthUser);
                    });
                })
        }
    });
}));