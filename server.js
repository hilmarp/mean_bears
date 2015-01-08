// SETUP
// ==============================================================

// Það sem þarf að nota
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Nota bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// Tengjast við DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bears');

// Nota Bear model
var Bear = require('./app/models/bear');

// ROUTES
// ==============================================================

// Nota Router
var router = express.Router();

// Middleware sem keyrir við hvert request
router.use(function(req, res, next) {
	console.log('Eitthvað er að gerast!');
	next();
});

// Prufu route til að vera viss um að allt virki
router.get('/', function(req, res) {
	res.json({ message: 'Þetta virkar!' });
});

// Routes sem enda á /bears
router.route('/bears')

	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) {
				res.send(err);
			} else {
				res.json(bears);
			}
		});
	})

	// Búa til bear
	.post(function(req, res) {
		var bear = new Bear();
		bear.name = req.body.name;

		bear.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({ message: 'Bear ' + bear.name + ' búinn til!' });
			}
		});
	});

// VIRKJA ROUTES
// ==============================================================

// Prefix /api
app.use('/api', router);

// KEYRA SERVER Í GANG
// ==============================================================
app.listen(port);
console.log('Server i gangi a porti ' + port);