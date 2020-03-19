'use strict'

// GENERATE PASSWORD RANDOM
exports.generate = async (req, res, next) => {
	const base = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","+","9",".","-","_","$","&","#","@"];

	let random = Math.round(Math.random() * 10);
	let password = '';

	for(let i = 0; i < 15; i++)
	{
		random = parseInt(Math.random() * base.length);
		password += base[random];
	}

	res.status(200).json({
		data: password
	});
}