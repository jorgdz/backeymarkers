'use strict'

const mongoose = require('mongoose');
const uniqueValidador = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const FolderSchema = new Schema({
	name: {
		type: String,
	  	required: [true, "Debes especificar un nombre para el Folder !!"],
        unique: true,
        uniqueCaseInsensitive: true,
	},
	description: String,
	user: { type: Schema.ObjectId, ref: 'User' }
});

FolderSchema.plugin(uniqueValidador, { message: '{PATH} ya existe !!' });

const Folder = mongoose.model('Folder', FolderSchema);
module.exports = Folder;