const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const OAuthUsers = require('../Models/oauth/user-model');
const LinkedinStrategy = require('passport-linkedin');
const TwitterStrategy = require('passport-twitter');

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

passport.use(new GoogleStrategy({
    //options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
}, (accessToken, refreshToken, profile, done) => {
    //check is user already exist in the database

    OAuthUsers.findOne({
        googleId: profile.id
    }).then((currentUser) => {
        if (currentUser) {
            //User is already in database
            console.log("User is:", currentUser);
            done(null, currentUser);
        } else {
            //if not create user in database
            new OAuthUsers({
                username: profile.displayName,
                googleId: profile.id,
                emailId: profile.emails[0].value
            }).save().then((newOAuthUser) => {
                done(null, newOAuthUser);
            });
        }
    });


}));

passport.use(new LinkedinStrategy({
    callbackURL: '/auth/linkedin/redirect',
    consumerKey: keys.linkedin.ClientID,
    consumerSecret: keys.linkedin.ClientSecret,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    OAuthUsers.findOne({
        linkedinId: profile.id
    }).then((currentUser) => {
        if (currentUser) {
            //User is already in database
            console.log("User is:", currentUser);
            done(null, currentUser);
        } else {
            //if not create user in database
            new OAuthUsers({
                username: profile.displayName,
                linkedinId: profile.id,
                emailId: profile._json.emailAddress,
            }).save().then((newOAuthUser) => {
                done(null, newOAuthUser);
            });
        }
    });

}));

passport.use(new TwitterStrategy({
    callbackURL: '/auth/twitter/redirect',
    consumerKey: keys.twitter.APIkey,
    consumerSecret: keys.twitter.APISecret,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    OAuthUsers.findOne({
        twitterId: profile.id
    }).then((currentUser) => {
        if (currentUser) {
            //User is already in database
            console.log("User is:", currentUser);
            done(null, currentUser);
        } else {
            //if not create user in database
            new OAuthUsers({
                username: profile.displayName,
                twitterId: profile.id,
                emailId: profile.emails[0].value,
            }).save().then((newOAuthUser) => {
                done(null, newOAuthUser);
            });
        }
    });
}))