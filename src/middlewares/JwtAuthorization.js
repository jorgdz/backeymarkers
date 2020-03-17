'use strict'

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authorize = async (req, res, next) => {
	if (req.headers["authorization"]) 
 	{
  		const accessToken = req.headers["authorization"];
  		const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
  		
  		// Check if token has expired
  		if (exp < Date.now().valueOf() / 1000) 
      { 
   			return res.status(401).json({ 
   				 error: "El token ha expirado por favor inicie sesión nuevamente !!" 
   			});
  		}
  		
  		res.locals.loggedInUser = await User.findById(userId).select('-password'); 
  		next();
 	} 
 	else 
 	{ 
  		next(); 
 	}
}