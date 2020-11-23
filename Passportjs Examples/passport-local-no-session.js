/*
This is minimum code to Authentication using
Passport-Local package. (without session information)

*/

var session      = require('express-session');
var express	   	 = require( 'express');
var passport 	 = require('passport');
var Strategy 	 = require('passport-local').Strategy; 


//============================================================
var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

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
//--------------------------------------------------------

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

//=======================================================
passport.use(new Strategy({		 	 
    session: false
  },
  //-------------------------------------------
  function(username, password, done) {
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return done(null, user);
    });
  }
  //--------------------------------------------
 ));
//=======================================================

app.post('/login', 
  passport.authenticate('local', {  
  failureRedirect: '/login',   
  session: false
  }),
  function(req, res) {
	res.json(JSON.stringify(req.user));    
  });

app.get('/login',
  function(req, res){
      res.sendFile('login.html', {root: __dirname })
  });


 app.listen(3000);