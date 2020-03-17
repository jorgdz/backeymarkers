const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');

exports.dropboxConnect = async () => {
	// dbid:AACtmxwSRR-0WvU5EnMDg01wsV2lV4WRpNw

	// create session ref:
	const dropbox = dropboxV2Api.authenticate({
	    token: process.env.DROPBOX_TOKEN
	});

	// use session ref to call API, i.e.:
	/*dropbox({
	    resource: 'users/get_account',
	    parameters: {
	        'account_id': 'dbid:AACtmxwSRR-0WvU5EnMDg01wsV2lV4WRpNw'
	    }
	}, (err, result, response) => {
	    if (err) { return console.log(err); }
	    console.log(result);
	});*/

	dropbox({
	    resource: 'files/download',
	    parameters: {
	        path: '/recuerdo.png'
	    }
	}, (err, result, response) => {
	    console.log(result);
	}).pipe(fs.createWriteStream('./image.jpg'));
}