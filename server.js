const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');

const connectDb = require('./config/mongoDb');
const Category = require('./models/Category');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const searchRoutes = require('./routes/search');
const productRoutes = require('./routes/product');
const accountRoutes = require('./routes/account');
const port = process.env.PORT;

connectDb();
app.set('view engine','ejs');
app.set('views','views');
app.use(express.static(path.join(__dirname,'public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser())
app.use(session({
     resave: true,
     saveUninitialized: true,
     secret: 'secretkeyyoudontknowhahaah'
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use((req,res,next) => {
     Category.find({},(err,categories) => {
         if(err) return next(err);

         res.locals.categories = categories;
         next();
     })
});

app.use('/',mainRoutes);
app.use(authRoutes);
app.use(apiRoutes);
app.use(searchRoutes);
app.use(productRoutes);
app.use(accountRoutes);

app.listen(port,() => {
    console.log(`App is running on port ${port}`)
})