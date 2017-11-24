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
	  	
	  else {
	  	spike.value = data.result.Last;
	  	initPair.spikes.push(spike);
	  	callback(initPair);
	  	return;
	  }
	});
	
}

bittrexapi.getLatestPrice = function(pair, callback) {
	bittrex.getticker( { market : pair }, function( data, err ) {
		if (data && data.result && data.result.Last)
			callback(data.result.Last);
		  	return;

		callback();
		return;

		});
}

module.exports = bittrexapi;