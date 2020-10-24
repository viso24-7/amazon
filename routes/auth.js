const route = require('express').Router();
const passport = require('passport');
require('../config/passport');
const User = require('../models/User');
const isLoggedIn = require('../middleware/isLoggedIn');
const {check,validationResult} = require('express-validator');

route.get('/signup', (req,res) => {
    if(req.user) return res.redirect('/');
    return res.render('authentication/signup',{errors:req.flash('errors')});
})

route.post('/signup',[check('email').isEmail().withMessage('please enter a valid message'),check('password').isLength({min:8,max:15}).withMessage('password field must be between 8 and 15 characters')],(req,res,next) => {
    const {name,email,password} = req.body;

    if (email) {
        User.findOne({ email }, (err, existUser) => {
          if (err) return next(Error('Database Error'));
    
          if (existUser) {
            req.flash('errors', 'Email already existed');
    
            return res.redirect('signup');
          }
    
          const user = new User();
          user.profile.name = req.body.name;
          user.email = req.body.email;
          user.password = req.body.password;
          user.profile.picture = user.gravatar();
    
          return user.save((errSave) => {
            if (errSave) return next(errSave);
    
            return req.logIn(user, (errLogIn) => {
              if (errLogIn) return next(errLogIn);
    
              return res.redirect('/profile');
            });
          });
        });
        return 0;
      }
      req.flash('errors', 'Email field is required');
      return res.redirect('signup');
})


route.get('/login',isLoggedIn,(req,res) => {
    return res.render('authentication/login',{loginMessage: req.flash('loginMessage')})
});

route.post('/login',passport.authenticate('local-login',{successRedirect:'/profile',failureRedirect:'/login',failureFlash:true}));

route.get('/logout',isLoggedIn,(req,res,next) => {
     req.logOut();
     return res.redirect('/');
})

module.exports = route;
