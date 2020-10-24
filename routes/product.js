const route = require('express').Router();
const Product =  require('../models/Product');
const Category = require('../models/Category');
const isLoggedIn = require('../middleware/isLoggedIn');
const {check,validationResult} = require('express-validator');


route.get('/add-category',isLoggedIn,(req,res,next) => {
      return res.render('product/add-category',{error: req.flash('error'),message: req.flash('message')})
});

route.post('/add-category',isLoggedIn,[check('name').isEmpty().withMessage('name field is required')],(req,res,next) => {
    const {name} = req.body;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
          req.flash('errors',errors.array())
     }else{
        Category.findOne(name,(err,category) => {
            if(err) return next(err)

            if(category){
                req.flash('error','Existed category');
                return res.redirect('/add-category')
            }

            category = new Category(name);
            category.save((err) => {
                if(err) return next(err);

                req.flash('message', 'Added new catefory successfuly');
                return res.redirect('/add-category');
            });
        })
    }
});

route.get('/:id',(req,res,next) => {
    Product.find({category:req.params.id}).populate('category').exec((err,products) => {
        if(err) return next(err);

        return res.render('product/category',{products})
    })
});

route.get('/product/:id',(req,res,next) => {
    Product.findById(req.params.id,(err,product) => {
        if(err) return next(err);

        return res.render('product/single-product',{product})
    })
});

module.exports = route;