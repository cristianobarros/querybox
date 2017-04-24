
import fs from 'fs';
import electron from 'electron';
import path from 'path';

class AppPath {

	getPath(file) {
		const app = this.getAppPath();
		return path.join(app, file);
	}

	getAppPath() {
		const home = this.getApp().getPath('home');
		return path.join(home, '.querybox');
	}

	getApp() {
		return electron.remote ? electron.remote.app : electron.app;
	}

	createAppPathIfDoNotExists() {
		const appPath = this.getAppPath();
		if (!fs.existsSync(appPath)) {
			fs.mkdir(appPath);
		}
	}

}

export default new AppPath();
