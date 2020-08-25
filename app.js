const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const exphbs  = require('express-handlebars');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


const app = express();

mongoose.Promise = global.Promise;
//Database Connection
mongoose.connect('mongodb://localhost:27017/cms',
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(db =>  console.log('Database Connected'))
    .catch(error => console.log(error));


app.use(express.static(path.join(__dirname, 'public')));

//Method Override
app.use(methodOverride('_method'));


// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))


//Passport
app.use(passport.initialize())
app.use(passport.session())

//Local Variables
app.use(flash());
app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    console.log(req.user)
    res.locals.success_message = req.flash('success_message');
    next();
});


//File Upload
app.use(upload());


//load helpers
const {selected, generateDate} = require('./helpers/hbsHelpers');

//Set view engine
app.engine('hbs', exphbs({defaultLayout: 'home', extname: 'hbs', helpers:{selected: selected, generateDate: generateDate}}));
app.set('view engine', 'hbs');

//Load routes
const home = require('./routes/home');
const admin = require('./routes/admin');
const adminPosts = require('./routes/admin/posts');
const adminCategories = require('./routes/admin/categories/index');

//Use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', adminPosts);
app.use('/admin/categories', adminCategories);



app.listen(3000, ()=>{
    console.log('Listening to port 3000');
});
 