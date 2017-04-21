
import fs from 'fs';
import electron from 'electron';
import path from 'path';

class AppPath {

	getPath(file) {
		const app = this.getAppPath();
		return path.join(app, file);
	}

	getAppPath() {
		const home = electron.remote.app.getPath('home');
		return path.join(home, '.quantum');
	}

	createAppPathIfDoNotExists() {
		const appPath = this.getAppPath();
		if (!fs.existsSync(appPath)) {
			fs.mkdir(appPath);
		}
	}

}

export default new AppPath();
