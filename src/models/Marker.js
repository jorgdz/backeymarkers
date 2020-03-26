'use strict'

const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
   	link: String,
	title: String,
    description: String,
    image: String,
    source: String,
   	url: String,
	name: String,
	username: String,
	email: String,
	pass: String,
	folder: { 
		type: mongoose.Schema.ObjectId, 
		ref: 'Folder' 
	}
}, {timestamps:  true});

module.exports = mongoose.model('Marker', markerSchema);