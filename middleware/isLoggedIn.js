const isLoggedIn = (req,res,next) => {
    if(!req.user){
        return res.redirect('/login');
    } else {
        next();
    }
}

module.exports = isLoggedIn;