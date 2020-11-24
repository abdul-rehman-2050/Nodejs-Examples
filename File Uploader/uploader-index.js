/*
This file will handle single and multipel file uploads
These directories are required 
/upload
/public
/public/fileuploader.html

 <!--  SINGLE FILE -->
<form action="/uploadfile" enctype="multipart/form-data" method="POST"> 
   <input type="file" name="myFile" />
   <input type="submit" value="Upload a file"/>
</form>

*/



var   express = require( 'express');
const multer  = require('multer');
const path    = require('path');
 

 

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
})
 
var upload = multer({ storage: storage });

//ROUTES WILL GO HERE
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/fileuploader.html');
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
    console.log(req.file.filename);
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
 
    res.send(files)
  
})
 
app.listen(3000, () => console.log('Server started on port 3000'));