
const sqlite3 = require('sqlite3') 

let db = new sqlite3.Database('./db/usertest.db',
       sqlite3.OPEN_READWRITE| sqlite3.OPEN_CREATE,
	     (err) => {
		  if (err) {
			console.error(err.message);
		  }else{
			console.log('Connected to the User\'s Test  database.');  
		  }
  
	});