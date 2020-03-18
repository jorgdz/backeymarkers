const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');

exports.dropboxConnect = (file_path, file_name) => {
	return new Promise((resolve, reject) => {

		const dropbox = dropboxV2Api.authenticate({
		    token: process.env.DROPBOX_TOKEN
		});

		dropbox({
		    resource: 'files/upload',
		    parameters: {
		        path: '/' + file_name
		    },
		    readStream: fs.createReadStream(file_path)
		}, (err, result, response) => {
		   	if (response && result) 
		   	{
		   		dropbox({
				    resource: 'sharing/create_shared_link_with_settings',
				    parameters: {
				        path: '/' + file_name,
				        settings: {
					        "requested_visibility": "public"
				    	}
				    },
				}, (error, result2, response2) => {
					if (response2 && result2) 
		   			{
		   				console.log(response2.body.url);
				   		return resolve(response2.body.url);
		   			}
		   			else if(error)
		   			{
		   				return reject(error);
		   			}
				});
		   	}
		   	else if(err)
		   	{
		   		return reject(err);
		   	}
		});
		
	});
}