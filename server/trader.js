'use strict';

const MongoClient = require('mongodb');
const config = require('./config');


const response = {"code":500,
					"message":"Generic Error"};

const trader = {};

trader.getSellables = function(callback) {

	MongoClient.connect(config.db.url, function(err, db) {
		const collection = db.collection('trades');

		collection.findOne({},{"_id": 0, "buys":1}, function(err, doc) {
			if (doc && doc.buys && doc.buys.length > 0) {
				const buyMarkets = [];
				doc.buys.forEach((buy => {buyMarkets.push(buy.market)}));
		    	callback(buyMarkets);
			}
		    else
		    	callback([]);
		    db.close();

		});
	});
	
}

trader.placeBuy = function(market, price, callback) {

	MongoClient.connect(config.db.url, function(err, db) {
		const collection = db.collection('trades');	

		collection.findOne({},{"_id": 0, "buys":1}, function(err, doc) {
			doc.buys.push({ "market":market,
					"price":price,
					"date":new Date()}
				 );

			collection.update({},{"$set": {"buys":doc.buys}}, function(err, resp) {

				if (resp && resp.result && resp.result.nModified)
					callback(response.result.nModified);
				else
					callback(-1);

			    db.close();

			});
		});
		
	});
	
}

trader.placeSell = function(market, price, callback) {

	MongoClient.connect(config.db.url, function(err, db) {
		const collection = db.collection('trades');	

		collection.findOne(function(err, doc) {
			for (let k = 0; k < doc.buys.length; k++) {
				let buy = doc.buys[k];
				if (buy.market == market) {

					let priceOld = buy.price;	
					let gainCurrency = "gain"+market.split('-')[0];
					let defBuyAmount = gainCurrency == "gainBTC" ? config.BUY_AM_BTC : config.BUY_AM_ETH;
					let gain = trader.getGainz(defBuyAmount,priceOld,price,config.FEES);
					doc[gainCurrency] += gain;
					doc.buys.splice(k,1);

					const logCollection = db.collection('transactions');
					logCollection.insertOne({
						"market": market,
						"gain": gain,
						"date": new Date()
					})
					.then(function(r) {

						if (!(r.insertedCount > 0) )
							console.log("ERROR Adding transaction for market "+market);

					});
				}
			}

			console.log(doc);
			collection.updateOne({},doc, function(err, resp) {
				console.log(err);
				console.log(resp);
				if (resp && resp.result && resp.result.nModified)
					callback(resp.result.nModified);
				else
					callback(-1);

			    db.close();

			});
		});
		
	});	
}

trader.getGainz = function(amount, priceOld, priceNew, fees) {
	return amount*(priceNew/priceOld-fees*(priceNew/priceOld+1));
}

module.exports = trader;