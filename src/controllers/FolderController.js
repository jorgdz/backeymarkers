'use strict'

const Folder = require('../models/Folder');


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
                    message: "Folder no encontrado !!"
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
					data: folderCreated
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