const route = require('express').Router();
const async = require('async/');
const faker = require('faker');
const Product = require('../models/Product');
const Category = require('../models/Category');

route.post('/search', (req,res,next) => {
    const {search_term} = req.body;

    return Product.find({query_string:{query:search_term}}, (err,product) => {
         if(err) return next(err)
         return res.json(product)
    })
})

route.post('/:name', (req,res,next) => {
    const {name} = req.params;

    async.waterfall([
        callback => {
            Category.findOne(name,(err,category) => {
                if(err) return next(err);
                if(category){ return callback(null,category); }

                return callback('Category not founded')
            })
        },
        (category,callback) => {
          for(let i=0; let < 30; i++){
            const product = new Product({
                category: category._id,
                name: faker.commerce.productName(),
                price: faker.commerce.price(),
                image: faker.image.image()
               });

               product.save();
           return callback(null,category);
          }
        }
    ],(err,category) => {
        if(err) return next(err);
        return res.json(`Add Products into ${category.name} successfully`)
    })
});

module.exports = route;