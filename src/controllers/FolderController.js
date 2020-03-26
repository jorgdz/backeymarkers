'use strict'

const Folder = require('../models/Folder');
const Marker = require('../models/Marker');


// GET ALL FOLDERS
exports.index = async (req, res, next) => {
	const folders = await Folder.find({}).populate({ path: 'user', select:'-password' }).exec();

	res.status(200).json({
		data: folders
	});
}


// GET FOLDER FOR AUTH USER
exports.myfolders = async (req, res, next) => {
	const folders = await Folder.find({ user: req.user._id }).populate({ path: "markers" }).exec();

	res.status(200).json({
		data: folders
	});
}

// GET COUNT FOLDERS
exports.myCountFolders = async (req, res, next) => {
	let folders = await Folder.find({ user: req.user._id });
	let markers = [];
	folders.map( f => {

		f.markers.map(m => {
			markers.push(m);
		});

	});

	const countFolder = folders.length;
	const countMarker = markers.length;

	res.status(200).json({
		data: {
			countFolders: countFolder,
			countMarkers: countMarker
		}
	});
}


// GET FOLDER BY ID
exports.show = async (req, res, next) => {
	const folderId = req.params.id;

	await Folder.findById(folderId).populate("markers").exec()
		.then(folder => {
			if (folder) {
			    res.status(200).json({
					data: folder
				});
            } else {
                res.json({
                    message: "Carpeta no encontrada !!"
                });
            }
		}).catch(err => {
			console.log(err);

			return res.status(500).send({
				error: 'Ha ocurrido un error interno en el servidor !!'
			});
		});
}


// CREATE FOLDER
exports.save = async (req, res, next) => {
	try
	{
		const userId = req.user._id;

		const folder = new Folder({
			name: req.body.name,
			description: req.body.description,
			user: userId,
			//markers: req.body.markers
		});

		// SAVE FOLDER
		await folder.save()
			.then(folderCreated => {
				res.status(202).json({
					data: folderCreated,
					message: 'Se ha agregado una carpeta !!'
				});
			})
			.catch(err => {
				let arrayErrors = [];

				err.message.replace('Folder validation failed: ', '').split(', ').forEach(e => {
					arrayErrors.push(e.split(': ')[1]);
				});

				return res.status(400).send({
					error: arrayErrors
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


// UPDATE FOLDER
exports.update = async (req, res, next) => {
	try
	{
		const folderId = req.params.id;

		const update = {
			name: req.body.name,
			description: req.body.description,
		};

		// FIND AND MODIFY FOLDER
		await Folder.findByIdAndUpdate(folderId, update, { new: true, runValidators: true, context: 'query' })
			.then(folderUpdated => {
				res.status(200).json({
					data: folderUpdated,
					message: 'Carpeta actualizada !!'
				});
			})
			.catch(err => {
				let arrayErrors = [];

				err.message.replace('Validation failed: ', '').split(', ').forEach(e => {
					arrayErrors.push(e.split(': ')[1]);
				});

				return res.status(400).send({
					error: arrayErrors
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


// DELETE FOLDER
exports.delete = async (req, res, next) => {
	try
	{
		const folderId = req.params.id;

		await Folder.findByIdAndDelete(folderId)
			.then(folderDeleted => {
				return Marker.deleteMany({ folder: folderId });
			})
			.then(markerDeleted => {
				return res.status(200).send({
					message: 'Carpeta eliminada !!'
				});
			})
			.catch(err => {
				return res.status(400).send({
					message: 'Ha ocurrido un error al intentar borrar la carpeta, intente luego !!',
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