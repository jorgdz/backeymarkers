'use strict'

exports.grantAccess = (permission) => {
	return async (req, res, next) => {
		try
		{
			if (req.user.role == 'admin')
			{
				if (permission == 'UPDATE_USERS' || permission == 'GET_USERS' || permission == 'DELETE_USERS' || permission == 'GET_USER_BY_ID' || 
					permission == 'UPDATE_USER_AUTH')
				{
					next();
				}
			}	
			else if(req.user.role == 'user')
			{
				if (permission == 'GET_USER_BY_ID' || permission == 'UPDATE_USER_AUTH')
				{
					next();
				}
				else
				{
					return res.status(403).json({
						error: 'Usted no tiene permisos para acceder a este recurso'
					});
				}
			}
		}
		catch(error)
		{
			next(error);
		}
	}
}