'use strict'

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
	name: {
		type: String,
	  	required: [true, "Debes especificar un nombre para el Folder !!"]
    },
	description: String,
	user: { 
		type: mongoose.Schema.Types.ObjectId, ref: 'User' 
	},
	markers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Marker'
		}
	]
}, {timestamps:  true});

module.exports = mongoose.model('Folder', folderSchema);