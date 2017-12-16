'use strict';

const MongoClient = require('mongodb');
const bittrexapi = require('./bittrexapi');
const config = require('./config');

const mongoapi = {};

const response = {"code":500,
					"message":"Generic Error"};

let mongoSession;
MongoClient.connect(config.db.url, function(err, db) {
	mongoSession = db;
});

//insert all market with pairs :pair-*
mongoapi.insertAllPairs = function() {
	bittrexapi.getLatestPrices(function(prices) {
		const markets = [];

		for (let pair in prices) {
			if (pair.split("-")[0] == "BTC" || pair.split("-")[0] == "ETH")
				markets.push({
					'pair':pair,
					'spikes':[{
						"perc":0,
						"value":prices[pair],
						"date": new Date()
					}]
				})
				
		};

		const collection = mongoSession.collection('pairs');
		collection.insertMany(markets)
		.then(function(r){
			console.log("Added "+r.insertedCount+" markets!");
		});
	});
}

//replace all spikes of a pair
mongoapi.replaceSpikes = function(pair, spikes, callback) {

		const collection = mongoSession.collection('pairs');
		collection.update({'pair':pair}, {'$set':{'spikes':spikes}}, function(err,response){
			//console.log(response);
			callback(response.result.nModified);
		});

}


//insert spike to an existing pair
mongoapi.insertSpike = function(pair, perc, value, callback) {

	if (value < config.MIN_VALUE) {
		callback({"code":503,
						"message":"Value is too low: spike won't be considered. Minimum is "+config.MIN_VALUE});
		return;
	}


	const collection = mongoSession.collection('pairs');

	collection.findOne({"pair":pair})
	.then(function(doc) {
		if (!doc) {
			callback(response);
			return;
		} else {

			const spike = {};
			spike.date = new Date();
			spike.perc = perc;
			spike.value = value;

			doc.spikes.unshift(spike);

			collection.updateOne({"pair":pair},doc)
			.then(function(r) {
				if (r.modifiedCount > 0) {
					callback({"code":200,
					"message":"Pair sucessfully updated"});					
				} else {
					callback(response);

				}
			});

		}
	});

}

//clean or init the whole db system (except the conifg)
mongoapi.init = function() {
	MongoClient.connect(config.db.url, function(err, db) {
		let collection = db.collection('trades');
		collection.deleteMany()
		  .then(function(r) {

		  	let collection = db.collection('transactions');
		  	collection.deleteMany()
			  .then(function(r) {

			  	let collection = db.collection('pairs');

			  	collection.deleteMany()
				  .then(function(r) {
				  	db.close();
				  	mongoapi.insertAllPairs();
				});
			});
		  	
		});
	});
}


//clean spikes for all markets in current loop
mongoapi.cleanSpikes = function() {

	MongoClient.connect(config.db.url, function(err, db) {
		const collection = db.collection('pairs');

		collection.updateMany({}, { "$set": { "spikes": [] } }, function(err, resp) {

			if (err)
				console.log(err);
			else {
				const UpLoop = require('./uploop');
				UpLoop.addSpike();
			}
			db.close();

		});

	});		
}

//insert a new watch pair (returns 0 (OK) 1 (existing) -1 (error))
mongoapi.insertPair = function(pair, callback) {

	MongoClient.connect(config.db.url, function(err, db) {

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

//return the list of all available pairs [{"pair":"BTC-ETH"},...]
mongoapi.findPairs = function(callback) {
	MongoClient.connect(config.db.url, function(err, db) {

	  const collection = db.collection('pairs');

	  collection.find({},{"_id": 0, "pair":1, "spikes": 1}).toArray(function(err, docs) {

	    callback(docs);
	    db.close();

	  });

	});
}

//return the list of all available pairs [{"pair":"BTC-ETH"},...]
mongoapi.findPair = function(pair, callback) {
	MongoClient.connect(config.db.url, function(err, db) {

	  const collection = db.collection('pairs');

	  collection.findOne({"pair":pair},{"_id": 0, "pair":1, "spikes": 1})
	  .then(function(doc) {

	  	callback(doc);
	  	db.close();

	  });

	});
}

//delete all pairs
mongoapi.deletePairs = function(callback) {
	MongoClient.connect(config.db.url, function(err, db) {

	  const collection = db.collection('pairs');

	  collection.deleteMany()
	  .then(function(r) {
	  	callback({"code":200,
							"message":"Deleted "+r.deletedCount+" pairs"});
	  	db.close();
	  });

	});
}

module.exports = mongoapi;