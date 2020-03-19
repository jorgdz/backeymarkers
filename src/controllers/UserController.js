'use strict'

const User = require('../models/User');
const Folder = require('../models/Folder');
const Marker = require('../models/Marker');

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
	  	const userId = req.user._id;
	 
	  	if (req.files) 
	  	{
	  		var file_path = req.files.image.path;
	  		//var file_name = file_path.split('\\')[2];     // LOCAL
	  		var file_name = file_path.split('/tmp/')[1];		// HEROKU
	  		
	  		console.log('TEMPORAL PATH: ' + file_path);
	  		console.log('NOMBRE: ' + file_name);

	  		await Dropbox.dropboxConnect(file_path, file_name)
	  			.then(resDropbox => {
	  				let link = resDropbox.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
			  		return User.findByIdAndUpdate(userId, { image: link });
	  			})
	  			.then(() => {
	  				const user = User.findById(userId).select('-password');
	  				return user;	
	  			})
	  			.then((resUser) => {
			  		res.status(200).send({
			  			data: resUser,
						message: 'Se ha actualizado su imagen de perfil !!'
					});
	  			})
	  			.catch(err => {
	  				console.log(err);

	  				return res.status(400).send({
						message: 'No se ha podido subir la imagen, intente luego'
					});
	  			});
	  	}

	}
	catch(error)
	{
		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
	}
}	


 /********************** NOTE: NO FUNTIONAL  ***********************/
// DELETE USER
exports.delete = async (req, res, next) => {
	try
	{
		const userId = req.params.id;

		//await User.findByIdAndDelete(userId);
		await User.findByIdAndRemove(userId)
			.then(userDeleted => {

				return Folder.find({ user: userDeleted._id });

			})
			.then(folders => {
				let arrayMarkers = [];

				return folders.map( f => {

					f.markers.map(m => {
						arrayMarkers.push(m);
					});

				});

				return arrayMarkers;
			})
			.then(markers => {
				console.log(markers)
				return Marker.remove({ _id: { $in: markers }});
				// DELETE MARKERS
				/*return markers.forEach( m => {
					console.log(m + '--')

					Marker.deleteMany({ _id: m });
				});*/
				/*Marker.remove({ _id: {$in: markers}}, (err, result) => {
					if (err) 
					{
						return res.status(400).send({
							message: 'Ups!!, ha ocurrido un error mientras se eliminaba los marcadores!'
						});
					}
				});*/
			})
			.then((markerDeleted) => {
				return Folder.deleteMany({ user: userId });
			})
			.then((folderDeleted) => {
				return res.status(200).send({
					message: 'Usuario eliminado !!'
				});
			})
			.catch(err => {
				return res.status(400).send({
					error: err
				});
			});
	} 
	catch(error)
	{
		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
	}
}