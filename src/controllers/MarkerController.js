'use strict'

const Marker = require('../models/Marker');
const Folder = require('../models/Folder');


// GET MARKERS FOR AUTH USER
exports.mymarkers = async (req, res, next) => {
	const folderId = req.params.id;
	const markers = await Marker.find({ folder: folderId }).populate({ path: "folder", select:"-markers" }).exec();

	res.status(200).json({
		data: markers
	});
}


// CREATE MARKER
exports.save = async (req, res, next) => {
	try
	{
		const marker = new Marker({
			link: req.body.link,
			name: req.body.name,
			folder: req.body.folder,
		});

		// SAVE MARKER
		await marker.save()
			.then(markerCreated => {
				Folder.findById(req.body.folder, (er, folder) => {
					folder.markers.push(markerCreated._id);
					folder.save((errFolder, saveFolder) => {
						if (saveFolder) 
						{
							res.status(202).json({
								data: markerCreated
							});
						}	
					});
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