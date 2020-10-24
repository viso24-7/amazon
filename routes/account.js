const route = require('express').Router();
const User = require('../models/User');

route.get('/profile', (req,res) => {
    if(req.user){
        req.flash('This user does not exist');
        res.render('account/profile');
    }

    return res.render('login')
});

route.get('/edit-profile', (req,res) => {
    if(req.user){
        res.render('account/edit-profile',{editProfileMessage: req.flash('editProfileMessage')})
    }

    return res.redirect('login');
})

route.post('/edit-profile', (req,res,next) => {
    const {name,address} = req.body;
    const {userId} = req.user._id;

        User.findByIdAndUpdate(userId,{$set:{profile:{name,address}}},{new:true}, (err,user) => {
            if(err) return next(err)
            if(user){
                return res.render('edit-profile',{user})
            }
        })
});

module.exports = route;

