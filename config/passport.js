const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use('local-login',new LocalStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true},
       (req,email,password,done) => {
            User.findOne(email,(err,user) => {
                if(err) return done(err);
                if(!user){
                    return done(null,false,req.flash('loginMessage','User not found'))
                }

                if(!user.comparePassword(password)){
                    return done(null,false,req.flash('loginMessage','Password is incorrect'))
                }

                return done(null,user);
            })
}));

passport.serializeUser((user,done) => {
    done(null,user._id)
});

passport.deserializeUser((id,done) => {
    User.findById(id,(err,user) => {
         done(err,user)
    })
})

exports.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated){
        next();
    }

    return res.redirect('/login');
}