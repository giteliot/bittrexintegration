'use strict';

const MongoClient = require('mongodb');
const bittrexapi = require('./bittrexapi');

const mongoapi = {};
// DB Connection URL
const url = 'mongodb://localhost:27017/brexdb';

//return the list of all available pairs [{"pair":"BTC-ETH"},...]
mongoapi.findPairs = function(callback) {
	MongoClient.connect(url, function(err, db) {

	  const collection = db.collection('currencies');

	  collection.find({},{"_id": 0, "pair":1}).toArray(function(err, docs) {
	  	const out = [];
	  	//docs.forEach( (val, key) => out.push(val.pair) );  	
	    callback(docs);
	    db.close();
	  });

	});
}

//insert a new watch pair (returns 0 (OK) 1 (existing) -1 (error))
mongoapi.insertPair = function(pair, callback) {
	var response = {"code":500,
					"message":"Generic Error"};

	MongoClient.connect(url, function(err, db) {

		const collection = db.collection('pairs');
		//cerca se pair esiste già fra le currencies
		collection.find({"pair":pair}).toArray(function(err, docs) {
			if(err) {	
				callback(response);
				db.close();
				return;
			}	

			if (docs.length > 0) {
				callback({"code":503,
				"message":"Pair already exists"});
				db.close();
				return;
			}		

			bittrexapi.getInitPair(pair, function(initPair){

				if (!initPair) {
					callback({"code":404,
					"message":"Pair does not exists on Bittrex"});
					db.close();
					return;
				} else {

					collection.insertOne(initPair)
					.then(function(r) {

						if (r.insertedCount > 0) {
							callback({"code":200,
							"message":"Pair sucessfully added"});
						} else {
							callback(response);
						}

					});

			    	db.close();

				}
			});

			
	  });

	});
}

const stubInitPair = {
	"pair":"STUB",
	"spikes": [
		{
			"date":"yyyymmdd hh:mm:ss",
			"perc":"+20%",
			"value":0.025
		}
	]
};

module.exports = mongoapi;