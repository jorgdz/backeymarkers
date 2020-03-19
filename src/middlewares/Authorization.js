'use strict'

exports.hasAuthority = (permission) => {
	return async (req, res, next) => {
		try
		{
			if (req.user.role == 'admin')
			{
				if (permission == 'UPDATE_USERS' || permission == 'GET_USERS' || permission == 'DELETE_USERS' || permission == 'GET_USER_BY_ID' || 
					permission == 'UPDATE_USER_AUTH' || permission == 'CREATE_FOLDER' || permission == 'GET_FOLDERS' || permission == 'GET_MY_FOLDERS' || 
					permission == 'GET_FOLDER_BY_ID' || permission == 'GET_MY_MARKERS' || permission == 'CREATE_MARKER' || permission == 'UPDATE_FOLDER' || 
					permission == 'DELETE_FOLDER' || permission == 'DELETE_MARKER' || permission == 'GET_MARKER_BY_ID' || permission == 'UPDATE_MARKER' || permission == 'GENERATE_PASSWORD')
				{
					next();
				}
			}	
			else if(req.user.role == 'user')
			{
				if (permission == 'GET_USER_BY_ID' || permission == 'UPDATE_USER_AUTH' || permission == 'CREATE_FOLDER' || permission == 'GET_MY_FOLDERS' || 
					permission == 'GET_FOLDER_BY_ID' || permission == 'GET_MY_MARKERS' || permission == 'CREATE_MARKER' || permission == 'UPDATE_FOLDER' || 
					permission == 'DELETE_FOLDER' || permission == 'DELETE_MARKER' || permission == 'GET_MARKER_BY_ID'|| permission == 'UPDATE_MARKER' || 
					permission == 'GENERATE_PASSWORD')
				{
					next();
				}
				else
				{
					return res.status(403).json({
						message: 'No tienes permisos para acceder a este recurso'
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