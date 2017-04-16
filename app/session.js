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

	function load() {
		return new Promise(function(fulfill, reject) {
			db.find({}, function(err, docs) {

				if (err) {
					reject(err);
					return;
				}

				if (docs.length > 0) {
					fulfill(docs[0]);
				} else {
					fulfill(getDefaultSession());
				}
			});
		});
	}

	function getDefaultSession() {
		return {
			activeTabIndex : 0,
			tabs : [getDefaultTab(1)]
		};
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
		load : load,
		save : save,
		getDefaultTab : getDefaultTab
	}
}

module.exports = new Session();
