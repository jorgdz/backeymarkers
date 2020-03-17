'use strict'

// VERIFY LOGIN USER
exports.authenticated = async (req, res, next) => {
	try
	{
		const user = res.locals.loggedInUser;
		if (!user) 
		{
			return res.status(401).json({
				error: 'Necesitas autenticación para acceder a este recurso'
			});
		}

		req.user = user;
		next();
	}
	catch(error)
	{
		return res.status(500).send({
			message: 'Ha ocurrido un error interno en el servidor !!'
		});
	}
}