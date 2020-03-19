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


// SHOW MARKER
exports.show = async (req, res, next) => {
	const markerId = req.params.id;
	const marker = await Marker.findById(markerId).populate({ path: "folder", select:"-markers" }).exec()
		.then(response => {
			if (response)
			{
				res.status(202).json({
					data: response
				});
			}
			else
			{
				res.status(404).send({
					message: 'Marcador no encontrado !!'
				});
			}
		})
		.catch(err => {
			console.log(err);

			return res.status(500).send({
				error: 'Ha ocurrido un error interno en el servidor !!'
			});
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
								message: 'Se ha creado un nuevo marcador !!',
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


// UPDATE MARKER
exports.update = async (req, res, next) => {
	try
	{
		const markerId = req.params.id;

		const update = {
			link: req.body.link,
	  		name: req.body.name
		}

		await Marker.findByIdAndUpdate(markerId, update)
			.then(m => {				
		  		res.status(200).json({
				  	data: m,
				  	message: 'Marcador actualizado !!'
				});
  			})
  			.catch(err => {
				return res.status(400).send({
					error: 'Ha ocurrido un error al intentar modificar este marcador, por favor intente luego !!'
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


// DELETE MARKER
exports.delete = async (req, res, next) => {
	try
	{
		const markerId = req.params.id;

		await Marker.findByIdAndDelete(markerId)
			.then(markerDeleted => {
				Folder.findById(markerDeleted.folder, (er, folder) => {

					const pos = folder.markers.indexOf(markerId);
					folder.markers.splice(pos, 1);
					
					folder.save((errFolder, updateFolder) => {
						if (updateFolder) 
						{
							return res.status(200).send({
								message: 'Marcador borrado !!',
								data: markerDeleted
							});
						}	
					});

				});
			})
			.catch(err => {
				return res.status(400).send({
					message: 'Ha ocurrido un error al intentar borrar el marcador, intente luego !!',
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