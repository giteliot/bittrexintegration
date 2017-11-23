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
	  console.log(data);
	  if (err) {
	  	callback();
	  	return;
	  }
	  	
	  else {
	  	spike.value = data.result.Last;
	  	initPair.spikes.push(spike);
	  	console.log(initPair);
	  	callback(initPair);
	  	return;
	  }
	});

	
}

module.exports = bittrexapi;