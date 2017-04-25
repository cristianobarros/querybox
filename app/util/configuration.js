
import fs from 'fs';

import AppPath from './app-path';

class Configuration {

	load() {
		return JSON.parse(fs.readFileSync(this.getFilePath(), 'utf8'));
	}

	save(data) {
		fs.writeFileSync(this.getFilePath(), JSON.stringify(data));
	}

	getDefault() {
		return {
			zoomFactor : 1,
			activeTabIndex : 0,
			theme : 'idle_fingers',
			keybindings: {
				newTab: 'Ctrl+T',
				closeTab: 'Ctrl+W',
				restoreTab: 'Ctrl+Shift+T',
				previousTab: 'Ctrl+PageUp',
				nextTab: 'Ctrl+PageDown',
				openFile: 'Ctrl+O',
				saveFile: 'Ctrl+S',
				executeQuery: 'Ctrl+Enter',
				formatQuery: 'Ctrl+Shift+F',
			},
		}
	}

	createDefaultIfDoNotExists() {
		const path = this.getFilePath();
		if (!fs.existsSync(path)) {
			this.save(this.getDefault());
		}
	}

	getFilePath() {
		return AppPath.getPath('configuration.json');
	}

}

export default new Configuration();
