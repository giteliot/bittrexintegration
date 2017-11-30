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
	 
	 spike.value = data.result.Last;
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
				prices[summary.MarketName] = summary.Last;
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
		if (data && data.result && data.result.Last) {
			callback(data.result.Last);
		  	return;
		}

		callback();
		return;

	});
}

bittrexapi.getAllMarkets = function(currency,callback) {
	bittrex.getmarkets( function( data, err ) {
		if (err) {
			callback();
			return;
		} 
		const pairs = [];
		data.result.forEach(function(market) {
			if (market.BaseCurrency.toUpperCase() == currency.toUpperCase())
				pairs.push(market.MarketName);
		});
		callback(pairs);
	});
}

module.exports = bittrexapi;