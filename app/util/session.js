
import uuid from 'uuid/v4';
import Datastore from 'nedb';

import AppPath from './app-path';

class Session {

	constructor() {
		this.db = new Datastore(
			{
				filename : AppPath.getPath('sessions.db'),
				autoload : true
			}
		);
	}

	getLastClosed() {
		return new Promise((fulfill, reject) => {
			this.db.find({ $not : { closedOn : null } }).sort({ closedOn : -1 }).limit(1).exec((err, docs) => {

				if (err) {
					reject(err);
					return;
				}

				fulfill(docs);
			});
		});
	}

	loadOpened() {
		return new Promise((fulfill, reject) => {
			this.db.find({ closedOn : null }).sort({ index : 1 }).exec((err, docs) => {

				if (err) {
					reject(err);
					return;
				}

				if (docs.length > 0) {
					fulfill(docs);
				} else {
					fulfill(this.getDefaultSession());
				}
			});
		});
	}

	getDefaultSession() {
		return [this.getDefaultTab(1)];
	}

	getDefaultTab(number) {
		return {
			uuid : uuid(),
			name : 'Tab ' + number,
			content : {
				sql : '',
				cursorPosition : { row : 0, column : 0 },
				result : null,
				message : '',
				split : [50, 50]
			}
		}
	}

	saveAll(docs) {
		return Promise.all(docs.map((doc) => {
			return this.save(doc);
		}));
	}

	save(doc) {
		return new Promise((fulfill, reject) => {
			if (doc._id == null) {
				this.db.insert(doc, (err, newDoc) => {

					if (err) {
						reject(err);
						return;
					}

					fulfill();
				});
			} else {
				this.db.update({ '_id' : doc._id,}, { $set : doc }, (err, numReplaced) => {

					if (err) {
						reject(err);
						return;
					}

					fulfill();
				});
			}
		});
	}

}

export default new Session();
