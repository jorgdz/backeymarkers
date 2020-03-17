'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarkerSchema = new Schema({
	link: String,
	folder: { type: Schema.ObjectId, ref: 'Folder' }
});

module.exports = mongoose.model('Marker', MarkerSchema);