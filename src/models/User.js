'use strict'

const mongoose = require('mongoose');
const uniqueValidador = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "El nombre es obligatorio"]
	},
	lastname: {
		type: String,
		required: [true, "El apellido es obligatorio"]
	},
	email: {
	  	type: String,
	  	required: [true, "El correo es obligatorio"],
        unique: true,
        uniqueCaseInsensitive: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'El correo no tiene un formato válido'],
       	trim: true
	},
	password: {
	  	type: String,
	  	required: [true, "La contraseña es requerida"]
	},
	role: {
	  	type: String,
	  	default: 'user',
	  	enum: ['user', 'admin']
	},
	image: String,
	accessToken: {
  		type: String
 	},
 	created_at: {
 		type: Date,
 		default: Date.now
 	}
});

userSchema.plugin(uniqueValidador, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('User', userSchema);