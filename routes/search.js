const route = require('express').Router();
const Product = require('../models/Product');

route.get('/', (req,res,next) => {
    const {q:queryString} = req.body;
    const query = { match_all: {} };
    const sort = { price: { order: 'asc' } };
    
     if(queryString){
        return Product.find({query_string:{query:queryString}}, (err,results) => {
            if(err) return next(err);
    
            const data = results.hits.map(hit => hit);
            return res.render('search/search-result',{queryString,data})
        })
     }

    return Product.find(query,{sort}, (err,results) => {
        if(err) return next(err);
    
        const data = results.hits.map(hit => hit);
        return res.render('search/search-result',{queryString:null,data})
    })
})

route.post('/',(req,res,next) => {
    const {q:queryString} = req.body;
    res.redirect(`/search?q=${queryString}`)
})

module.exports = route;