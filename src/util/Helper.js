'use strict'

const bcrypt = require('bcrypt');

exports.bCryptPasswordEncoder = async (password) => {
	return await bcrypt.hash(password, 10);
}

exports.validatePassword = async (plainPassword, bCryptPassword) => {
	return await bcrypt.compare(plainPassword, bCryptPassword);
}
