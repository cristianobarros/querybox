'use strict';

function Session() {

	var Datastore = require('nedb');

	var db = new Datastore({ filename: "sessions.db", autoload: true });

	function load(callback) {
		db.find({}, function(err, docs) {
			if (docs.length > 0) {
				callback(docs[0]);
			} else {
				callback(getDefaultSession());
			}
		});
	}

	function getDefaultSession() {
		return {
			sql : "",
			cursorPosition : {row:0, column:0},
			result : null,
			info : ""
		}
	}

	function save(doc, callback) {
		if (doc._id == null) {
			db.insert(doc, function (err, newDoc) {
				callback();
				event.sender.send('close-ok');
			});
		} else {
			db.update({ "_id" : doc._id,}, { $set : doc }, function (err, numReplaced) {
				callback();
			});
		}
	}

	return {
		load : load,
		save : save
	}
}

module.exports = Session;