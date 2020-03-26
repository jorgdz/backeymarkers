'use strict'

const urlMetadata = require('url-metadata');

// GET METADATA URL
exports.metadata = async (req, res, next) => {
	const url = req.body.url;

	urlMetadata(url)
		.then(
	  		metadata => { 
	    		res.status(200).json({
					data: metadata
				});
	  		},
	    	error => { 
	    		res.status(400).json({
					error: 'No se ha podido obtener información de la URL ' + url
				});
			});
}