'use strict';

const mongoapi = require('./mongoapi');
const bittrexapi = require('./bittrexapi');
const UpLoop = {};

UpLoop.update = function(spikeSize) {
	console.log("Updating spikes");
		mongoapi.findPairs(function(pairs) {
			for (var k in pairs) {
				let pair = pairs[k].pair;

			    if (!pair.spikes || pair.spikes.length < 1)
			    	return;
			    
				let currentPrice = pairs[k].spikes[0].value;
				bittrexapi.getLatestPrice(pair, function(price){

					if (price && Math.abs(price/currentPrice-1)*100 > spikeSize ) {
						let perc = (price > currentPrice) ? spikeSize : -1*spikeSize;
						mongoapi.insertSpike(pair, perc, price, function(resp) {
							console.log('For market '+pair+': '+resp.message);
						});
					}

				});
			}
		});
}

UpLoop.addSpike = function() {
	console.log("Initializing spikes");
		mongoapi.findPairs(function(pairs) {
			for (var k in pairs) {
				let pair = pairs[k].pair;

				bittrexapi.getLatestPrice(pair, function(price){
						mongoapi.insertSpike(pair, 0, price, function(resp) {
							console.log('Initalized spike for '+pair);
						});

				});
			}
		});
}

//loop interval (1 check every [intervalTime] seconds)
//a spike is registered if the price goes +- [spikeSize]%
UpLoop.start = function(spikeSize, intervalTime) {
	setInterval(function(){
		
		UpLoop.update(spikeSize);

	}, intervalTime*1000);
}



module.exports = UpLoop;