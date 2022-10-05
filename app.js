const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors")
const cookieParser = require("cookie-parser");

const app = express();



// create router
const authRouter = require('./Routes/auth_router');
const userRouter = require('./Routes/user_router');
const indexRouter = require('./Routes/index_router');
const questionRouter = require('./Routes/question_router');

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/bootstrap',express.static(path.join(__dirname, 'public/bootstrap')));
app.use('/img',express.static(path.join(__dirname, 'public/img')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/node_modules',express.static(path.join(__dirname, 'public/node_modules')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// use router
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter);
app.use('/', indexRouter);




// Database Connection
mongoose.connect('mongodb://localhost/QAPlatform', { useNewUrlParser: true }, function(err){
	
	if(err){
		console.log("error in connecting "+ err)
	}
	else{
		console.log("connecting successfully to the database")
	}
});




// When no path is found, send the 404 response
app.use( function (req, res, next){
	res.status(404).json({
		code: 404,
		message:"404 - Not Found"
	})
});




// Run Server
const PORT = process.env.PORT || 5052;
app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});

