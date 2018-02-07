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
					if (prices && sellables && pairs)
						pairs.forEach(function(pair) {						
								UpLoop.analyzeMarket(pair,prices[pair.pair],config.SPIKE,config.MEMORY, sellables);						
						});
					else {
						console.log("!!! Something went wrong...skipping update !!!");
						if (!prices)
							console.log("!!! Prices not retrieved");
						if (!sellables)
							console.log("!!! Sellables not retrieved");
						if (!pairs)
							console.log("!!! Pairs not retrieved");

					}
				});			
			});
		});
}


//1. Clean old spikes
//2. Check if you can sell the market (if yes -> sell)
//3. Reinitialize spikes if empty
//4. If not empty, check if buyable (if yes -> buy)
//5. If needed, update spikes to db
UpLoop.analyzeMarket = function(pair,price,spikeSize,memorySize, sellables) {
	const name = pair.pair;
	let spikes = pair.spikes;
	let cleanedCount = UpLoop.cleanOldSpikes(spikes,memorySize);
	let upNeeded;

	if (cleanedCount > 0) {

		console.log("Cleaning "+cleanedCount+" from market "+name);
		upNeeded = true;

	}

	if ( sellables.indexOf(name) != -1 ) {

		trader.placeSell(name, price, function(modified){
			if (modified && modified != -1) {
			} else {
				console.log("Something went wrong selling "+name);
			}
		});

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
		const perc = (price/currentPrice-1)*100;
		const lastPerc = pair.spikes[0].perc;

		//check if increment last spike
		if (price && Math.abs(perc) <= spikeSize && perc*lastPerc > 0) {
			upNeeded = true;
			spikes.shift();
			spikes.unshift({
		            "date": new Date(),
		            "perc": perc+lastPerc,
		            "value": price
        	});
		}	

		//IF There is a Spike
		if (price && Math.abs(perc) > spikeSize ) {
			
			const mult = perc > 0? 1 : -1;
			const numSpikes = (Math.floor((mult*perc)/spikeSize))-1;
			
			for (let k = 0; k < numSpikes; k++) {
				spikes.unshift({
		            "date": new Date(),
		            "perc": mult*spikeSize,
		            "value": currentPrice*(100+mult*spikeSize*(k+1))/100
        		});

        		console.log('Created split-spike for market '+name+': '+mult*spikeSize.toFixed(2)+"%");

			}

			spikes.unshift({
	            "date": new Date(),
	            "perc": perc-mult*(spikeSize*numSpikes),
	            "value": price
        	});

			upNeeded = true;
			console.log('Found spike for market '+name+': '+(perc-mult*(spikeSize*numSpikes)).toFixed(2)+"%");

			if (perc < 0) {
				let analysis = analyzer.getMarketAnalysis(pair);
				if (analysis.buyable == true) {

						trader.placeBuy(name, price, price*(1+analysis.targetSell/100), analysis.targetSell,function(modified){
							if (modified && modified != -1) {
								console.log(">>> Bought "+name+" for "+price);
							} else {
								console.log("Something went wrong buying "+name);
							}
						});

				}
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

	if (spikes.length > 1 && spikes[spikes.length-1].perc == 0) {
		spikes.pop(); 
		cleanedCount++;
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