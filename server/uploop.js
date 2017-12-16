'use strict';

const mongoapi = require('./mongoapi');
const bittrexapi = require('./bittrexapi');
const analyzer = require('./analyzer');
const trader = require('./trader.js');
const config = require('./config');
const UpLoop = {};

UpLoop.update = function() {
	console.log("Updating spikes "+(new Date()));
		mongoapi.findPairs(function(pairs) {
			bittrexapi.getLatestPrices(function(prices){
				trader.getSellables(function(sellables) {
					pairs.forEach(function(pair) {
						if (prices && sellables)
							UpLoop.analyzeMarket(pair,prices[pair.pair],config.SPIKE,config.MEMORY, sellables);
						else
							console.log("Something went wrong...skipping update");
					});
				});			
			});
		});
}

UpLoop.analyzeMarket = function(pair,price,spikeSize,memorySize, sellables) {
	const name = pair.pair;
	let spikes = pair.spikes;
	let cleanedCount = UpLoop.cleanOldSpikes(spikes,memorySize);
	let upNeeded;

	if (cleanedCount > 0) {

		console.log("Cleaning "+cleanedCount+" from market "+name);
		upNeeded = true;

	}

	if (spikes.length < 1) {

		spikes = [{
            "date": new Date(),
            "perc": 0,
            "value": price
        }];

        upNeeded = true;
        console.log("Spikes are empty after cleaning for "+name+". Reinitiating spikes");

	} else {

		const currentPrice = pair.spikes[0].value;
		if (price && Math.abs(price/currentPrice-1)*100 >= spikeSize ) {
			const perc = (price/currentPrice-1)*100;
			spikes.unshift({
	            "date": new Date(),
	            "perc": perc,
	            "value": price
        	});

			upNeeded = true;
			console.log('Found spike for market '+name+': '+perc.toFixed(2)+"%");

			if (perc < 0) {
				let analysis = analyzer.getMarketAnalysis(pair);
				if (analysis.rank > config.ALERTRANK) {

					trader.placeBuy(name, price, function(modified){
						if (modified && modified != -1) {
							console.log(">>> Bought "+name+" for "+price);
						} else {
							console.log("Something went wrong buying "+name);
						}
					});

				}
			}  else if ( sellables.indexOf(name) != -1 ) {

				trader.placeSell(name, price, function(modified){
					if (modified && modified != -1) {
					} else {
						console.log("Something went wrong selling "+name);
					}
				});

			}
		}
		
	}


	if (upNeeded) {
		mongoapi.replaceSpikes(name, spikes, function(modifiedCount){
			if (!modifiedCount)
				console.log("ERROR updating spikes for "+name);
		});
	}
		
	
}

UpLoop.cleanOldSpikes = function(spikes, memorySize) {
	if (!spikes || spikes.length < 1)
		return 0;

	let cleanedCount = 0;
	let oldestSpike = spikes[spikes.length-1];
	const now = new Date();
	while( oldestSpike && oldestSpike.date && now.getTime() - oldestSpike.date.getTime() > 1000*3600*memorySize) {
		spikes.pop();
		cleanedCount++;
		oldestSpike = spikes[spikes.length-1];
	}
	return cleanedCount;
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
UpLoop.start = function() {
	setInterval(function(){
		
		UpLoop.update();

	}, config.LOOP_INTERVAL*1000);
}



module.exports = UpLoop;