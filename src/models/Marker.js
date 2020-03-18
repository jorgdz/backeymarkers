'use strict'

const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
	link: String,
	name: String,
	folder: { 
		type: mongoose.Schema.ObjectId, 
		ref: 'Folder' 
	}
});

module.exports = mongoose.model('Marker', markerSchema);