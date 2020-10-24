const route = require('express').Router();
const Product = require('../models/Product');

const pagination = (req,res,next) => {
    const {page} = req.params;
    const perPage = 9;

    if(!page){
        return res.redirect('/page/1')
    }

    return Product.find({}).skip(perPage * page).limit(perPage).populate('category').exec((err,products) => {
        if(err) return next(err)

        return Product.count().exec((errCount,count) => {
            if(errCount) return next(errCount)

            const pages = count/perPage;
            res.render('main/products-main',{products,pages,page})
        })
    })
}

route.get('/',(req,res,next) => {
    if(req.user){
        return pagination(req,res,next);
    }

    res.render('main/home')
});

route.get('/page/:page',(req,res,next) => {
    if(req.user){
        return pagination(req,res,next);
    }

    res.render('main/home') 
});

route.get('/about',(req,res) => {
    res.render('main/about');
})

module.exports = route;