'use strict'

const User = require('../models/User');
const Helper = require('../util/Helper');
const Dropbox = require('../util/Dropbox');

/*************************TRANSACTIONS FOR USER*************************/

// GET USER AUTH
exports.getUserAuth = (req, res, next) => {
    //here it is
    var user = req.user;
    res.status(200).json({
		data: user
	});
};


// GET ALL USERS
exports.index = async (req, res, next) => {
	const users = await User.find({}).select('-password');

	res.status(200).json({
		data: users
	});
}


// GET USER BY ID
exports.show = async (req, res, next) => {
	try
	{
		const userId = req.params.id;

		const user = await User.findById(userId).select('-password');
		if (!user)
		{
			return res.status(404).send({
				message: 'No hemos encontrado un usuario con el ID: ' + userId
			});
		} 
		
		res.status(200).json({
			data: user
		});
	}
	catch(error)
	{
		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
	}
}


// UPDATE USER
exports.update = async (req, res, next) => {
 	try
  	{
  		// GET ID USER AUTH   OR   PARAM'S ID
	  	const userId = (req.params.id != null && req.params.id != '' && req.params.id != undefined) ? req.params.id : req.user._id;
  		
  		const passwordEncoder = (req.body.password == null || req.body.password == '' || req.body.password == undefined) 
								? '' : await Helper.bCryptPasswordEncoder(req.body.password);

	  	const update = {
	  		name: req.body.name,
			lastname: req.body.lastname,
			email: (req.body.email != null && req.body.email != '' && req.body.email != undefined) ? req.body.email.toLowerCase() : '',
			password: passwordEncoder,
		}

		// modify user data
  		await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true, context: 'query' })
  			.then(u => {				
		  		res.status(200).json({
				  	data: u,
				  	message: 'Datos de usuario actualizado !!'
				});
  			})
  			.catch(err => {
  				let errors = [];
				
				err.message.replace('Validation failed: ', '').split(', ').forEach(e => {
					errors.push(e.split(': ')[1]);
				});

				return res.status(400).send({
					error: errors
				});
  			});
 	} 
 	catch (error) 
 	{
  		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
 	}
}



// UPLOAD USER IMAGE
exports.uploadImage = async (req, res, next) => {
	try
	{
		// GET ID USER AUTH
	  	//const userId = req.user._id;
	  	await Dropbox.dropboxConnect();
	}
	catch(error)
	{
		console.log(error);

		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
	}
}	



// DELETE USER
exports.delete = async (req, res, next) => {
	try
	{
		const userId = req.params.id;

		await User.findByIdAndDelete(userId);
		
		res.status(200).json({
			data: null,
			message: 'Usuario eliminado !!'
		});
	} 
	catch(error)
	{
		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
	}
}