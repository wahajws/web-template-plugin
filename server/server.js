'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
// const https = require('https');
const app = express();
const database = require('./config/database');

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000);

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// for parsing json
app.use(
	express.json({
		limit: '20mb'
	})
);

// for parsing application/x-www-form-urlencoded
app.use(
	express.urlencoded({
		limit: '20mb',
		extended: true
	})
);

// Init all other stuff
app.use(cors({ 
	credentials: true, 
	origin: 'http://localhost:3001'
}));
app.use(passport.initialize());
// app.use(compression());
// app.use(helmet());
app.use(express.static('public'));

// app.use('/uploads', express.static('uploads'));
// app.use(cookieParser());
app.use(require('./app/routes'));

// Start the server
app.listen(app.get('port'), function() {
	console.log('App listening on port ' + app.get('port') + '!');
});

// Connect to database!!
database.connect();

module.exports = app; // for testing
