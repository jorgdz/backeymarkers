'use strict'

// REQUIRE DEPENDENCIES
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');


// REQUIRE AND CONFIG ENV VAR
require('dotenv').config({
	path: path.join(__dirname, '../.env')
});


// REQUIRE MODULES APPLICATION
const JwtAuthorization = require('./middlewares/JwtAuthorization');
const routes = require('./routes/routes');


// SET PORT
const PORT = process.env.PORT || 3900;


/* CONNECT MONGO DB */
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect(process.env.URL, { useNewUrlParser:true, useUnifiedTopology: true })
	.then(() => {
		console.log('Conexión OK');
	})
	.catch(err => console.log(err));


// CONFIG REQUEST IN JSON FORMAT
app.use(bodyParser.urlencoded({ extended: true }));


// CONFIG CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});



// VERIFY AUTHORIZATION WITH TOKEN IN ALL REQUEST
app.use(JwtAuthorization.authorize);


// USE ROUTES
app.use('/api', routes);


// SERVER LISTEN
app.listen(PORT, () => {
	console.log('Servidor iniciado en el puerto: ' + PORT);
});

app.get(['/', '/api'], (req, res) => {
	res.status(403).send({
		date: new Date(),
		message: 'No autorizado !!'
	});
});