'use strict';

const MongoClient = require('mongodb');
const config = require('./config');


const response = {"code":500,
					"message":"Generic Error"};

const trader = {};

let mongoSession;
MongoClient.connect(config.db.url, function(err, db) {
	mongoSession = db;
});

trader.getSellables = function(callback) {

	const collection = mongoSession.collection('trades');

	collection.find().toArray(function(err, docs) {
		const buyMarkets = [];
		docs.forEach((doc => {buyMarkets.push(doc.market)}));
	    callback(buyMarkets);
	});
	
}

trader.placeBuy = function(market, price, callback) {

	const collection = mongoSession.collection('trades');	

	collection.insertOne({
		"market":market,
		"price":price,
		"date":new Date()
	})
	.then(function(r){
		callback(r.insertedCount);
	});		
	
}

//TODO rework del sell per il nuovo DATA MODEL dei trades
trader.placeSell = function(market, price, callback) {

	const collection = mongoSession.collection('trades');	

	collection.find({"market":market}).toArray(function(err, docs) {

		docs.forEach(function(doc){

			let priceOld = doc.price;
			let baseCurrency = market.split('-')[0];
			let defBuyAmount = baseCurrency == "BTC" ? config.BUY_AM_BTC : config.BUY_AM_ETH;
			let gain = trader.getGainz(defBuyAmount,priceOld,price,config.FEES);

			collection.deleteOne({"market":market,"price":priceOld})
			.then(function(r){
				if (!r || !r.deletedCount)
					console.log("Something went wrong cleaning the buy order for "+market);
			});
			//remove trade
			const logCollection = mongoSession.collection('transactions');
			logCollection.insertOne({
					"market": market,
					"gain": gain,
					"date": new Date()
			})
			.then(function(r) {

				if (!(r.insertedCount > 0) )
					console.log("ERROR Adding transaction for market "+market);
				else {
					console.log("<<< Sold "+market+" for "+price+": gained "+gain);

				}


			});

		});

	});
}

trader.getGainz = function(amount, priceOld, priceNew, fees) {
	return amount*(priceNew/priceOld-1-fees*(priceNew/priceOld+1));
}

module.exports = trader;