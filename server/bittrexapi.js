'use strict';

var bittrex = require('node-bittrex-api');
const bittrexapi = {};

bittrexapi.getInitPair = function(pair, callback) {
	const initPair = {};
	initPair.pair = pair;
	initPair.spikes = [];
	const spike = {};
	spike.date = new Date();
	spike.perc = 0;
	//get ticker
	bittrex.getticker( { market : pair }, function( data, err ) {
	  if (err) {
	  	callback();
	  	return;
	  }
	 
	 if (!data.result) 	{
		callback();
	  	return;
	 }
	 
	 spike.value = (data.result.Bid+data.result.Ask)/2;
	 initPair.spikes.push(spike);
	 callback(initPair);
	 return;

	});
	
}

//get latest price for every market on bittrex
bittrexapi.getLatestPrices = function(callback) {
	bittrex.getmarketsummaries( function( data, err ) {
		if (data && data.result) {
			const prices = {};
			data.result.forEach(function(summary){
				prices[summary.MarketName] = (summary.Bid+summary.Ask)/2;
			});
			callback(prices);
		  	return;
		}
			

		callback();
		return;

	});
}

//get latest price for a specific market
bittrexapi.getLatestPrice = function(pair, callback) {
	bittrex.getticker( { market : pair }, function( data, err ) {
		if (data && data.result && data.result.Bid && data.result.Ask) {
			callback((data.result.Bid+data.result.Ask)/2);
		  	return;
		}

		callback();
		return;

	});
}

bittrexapi.getAllMarkets = function(callback) {
	bittrex.getmarkets( function( data, err ) {
		if (err) {
			callback();
			return;
		} 
		const pairs = [];
		data.result.forEach(function(market) {
				pairs.push(market.MarketName);
		});
		callback(pairs);
	});
}

module.exports = bittrexapi;