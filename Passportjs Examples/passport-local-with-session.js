/*

Testing passport
https://github.com/passport/express-4.x-local-example/blob/master/db/users.js
*/


var flash    = require('connect-flash');
const path = require("path");
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var express	   	 = require( 'express');
var passport 	 = require('passport');
var Strategy 	 = require('passport-local').Strategy; 

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

var findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

var findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}




var app = express();
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Configure view engine to render EJS templates.
app.set('views', __dirname+"/views");
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use(session({
	name: 'session-id',
    secret: 'thisisdemopassportapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


 

passport.use(new Strategy({
	
		usernameField: 'email',
		passwordField: 'password',
	
	failureFlash: true,
    session: false
  },
  function(username, password, done) {
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return done(null, user);
    });
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
   findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


app.get('/login',
  function(req, res){
    res.render('login',{message:"nothing"});
  });
  
 

app.post('/login', 
  passport.authenticate('local', { 
  successRedirect: '/profile',
  failureRedirect: '/error', 
  failureFlash: 'Invalid username or password.' ,
  session: true
  }),
  function(req, res) {
    res.render('profile', { user: req.user });
  });

// Define routes.
app.get('/',
  function(req, res) {	   
    res.render('home', { user: req.user });
  });

app.get('/signup',
  function(req, res) {
    res.render('signup', { message: "something" });
  });



app.get('/welcome',
  function(req, res) {
    res.send(req.user);
  });
  
  app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/error',
  function(req, res) {
    res.send("some error");
  });  
  //------------------------------------
  var getUser = function (req) {
  var user = req.session.user;

  if (user == null) {
	  console.log('no user found');
    throw('Error');
  } else {
	  console.log('user found');
	  console.log(user)
    return user;
  }
};
//------------------------------
  
 app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
	   
		res.render('profile', { user: req.user });	  
	   
    
  });
 app.listen(3000);