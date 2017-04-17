'use strict';

import uuid from 'uuid/v4';

import AppPath from './app-path';

function Session() {

	var Datastore = require('nedb');

	var db = new Datastore(
		{
			filename : AppPath.getPath("sessions.db"),
			autoload : true
		}
	);

	function getLastClosed() {
		return new Promise(function(fulfill, reject) {
			db.find({ $not : { closedOn : null } }).sort({ closedOn : -1 }).limit(1).exec(function(err, docs) {

				if (err) {
					reject(err);
					return;
				}

				fulfill(docs);
			});
		});
	}

	function loadOpened() {
		return new Promise(function(fulfill, reject) {
			db.find({ closedOn : null }).sort({ index : 1 }).exec(function(err, docs) {

				if (err) {
					reject(err);
					return;
				}

				if (docs.length > 0) {
					fulfill(docs);
				} else {
					fulfill(getDefaultSession());
				}
			});
		});
	}

	function getDefaultSession() {
		return [getDefaultTab(1)];
	}

	function getDefaultTab(number) {
		return {
			uuid : uuid(),
			name : "Tab " + number,
			content : {
				sql : "",
				cursorPosition : { row : 0, column : 0 },
				result : null,
				message : "",
				split : [50, 50]
			}
		}
	}

	function saveAll(docs) {
		return Promise.all(docs.map(function(doc) {
			return save(doc);
		}));
	}

	function save(doc) {
		return new Promise(function(fulfill, reject) {
			if (doc._id == null) {
				db.insert(doc, function (err, newDoc) {

					if (err) {
						reject(err);
						return;
					}

					fulfill();
				});
			} else {
				db.update({ "_id" : doc._id,}, { $set : doc }, function (err, numReplaced) {

					if (err) {
						reject(err);
						return;
					}

					fulfill();
				});
			}
		});
	}

	return {
		loadOpened : loadOpened,
		save : save,
		saveAll : saveAll,
		getLastClosed : getLastClosed,
		getDefaultTab : getDefaultTab
	}
}

module.exports = new Session();
