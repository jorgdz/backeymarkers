'use strict'

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Helper = require('../util/Helper');


// REGISTER A NEW USER
exports.register = async(req, res, next) => {
	try
	{
		const passwordEncoder = (req.body.password == null || req.body.password == '' || req.body.password == undefined) 
								? '': await Helper.bCryptPasswordEncoder(req.body.password);

		const user = new User({
			name: req.body.name,
			lastname: req.body.lastname,
			email: (req.body.email != null && req.body.email != '' && req.body.email != undefined) ? req.body.email.toLowerCase() : '',
			password: passwordEncoder,
			role: req.body.role || 'user',  // ROLE DEFAULT
			image: null,
		});

		// GENERATE TOKEN JWT
		const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d"
		});

		user.accessToken = accessToken;
		await user.save()
			.then(u => {
				res.status(202).json({
					data: u
				});
			})
			.catch(error => {
				let arrayErrors = [];

				error.message.replace('User validation failed: ', '').split(', ').forEach(e => {
					arrayErrors.push(e.split(': ')[1]);
				});

				return res.status(400).send({
					error: arrayErrors
				});
			});
	}
	catch(error)
	{
		next(error);
	}
}



// LOGIN USER
exports.login = async (req, res, next) => {
	try
	{
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user)
		{
		 	return res.status(404).send({ message: 'El correo no existe en nuestros registros, por favor intente nuevamente !!' });
		}

		const validPassword = await Helper.validatePassword(password, user.password);
		if (!validPassword) 
		{
			return res.status(402).send({ message: 'La contraseña es incorrecta !!' });
		}
		
		// ALL OK THEN GO LOGIN !!
		const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d"
		});

		// UPDATE TOKEN IN MONGO
		await User.findByIdAndUpdate(user._id, { accessToken });

		res.status(200).json({
			data: {
				email: user.email,
				role: user.role
			},
			accessToken
		});
	}
	catch(error)
	{
		next(error);
	}
}