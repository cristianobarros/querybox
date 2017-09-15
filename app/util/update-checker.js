
import request from 'request';
import config from './../package.json';

class UpdateChecker {

	hasUpdateAvaliable() {
		return new Promise((fulfill, reject) => {
			const repository = config.repository.replace('https://github.com/', '');
			request({
			  url: 'https://api.github.com/repos/' + repository + '/releases/latest',
			  headers: {
			    'User-Agent': 'request'
			  }
			}, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					const latestVersion = JSON.parse(body).tag_name;
					const currentVersion = 'v' + config.version;
					fulfill(latestVersion !== currentVersion);
				}
			});
		});
	}

}

export default new UpdateChecker();
