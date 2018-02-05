'use strict';

const mongoapi = require('./mongoapi');
const fs = require('fs');
const config = require('./config');
const analyzer = {};

const response = {"code":500,
					"message":"Generic Error"};

//get all spikes and write them in a .csv file
analyzer.writeSpikesCsv = function(callback) {

	mongoapi.findPairs(function(docs){

		const writeStream = fs.createWriteStream("files/marketSpikes.csv");
	  	writeStream.write("MARKET,PERCENTAGE,VALUE,DATE\n");
	  	docs.forEach( function(val,key) {
	  		let pair = val.pair;
	  		val.spikes.forEach(function(spike){
	  			let row = pair+","+spike.perc+","+spike.value+","+spike.date+"\n";
	  			writeStream.write(row);
	  		});	  		
	  	});
	  	writeStream.end();
	    callback({"code":200,
						"message":"Created file marketSpikes.csv"});
	});
}

analyzer.getSpikesData = function(callback) {

	mongoapi.findPairs(function(docs){

		const analysis = {};
		const analyzable = [];
		let totSpikes = 0;
		let tmpSpikes;

	  	docs.forEach( function(val,key) {
	  		tmpSpikes = val.spikes.length;
	  		totSpikes += tmpSpikes;
	  		if (tmpSpikes > config.MIN_SPIKES)
	  			analyzable.push(val.pair+"("+tmpSpikes+")");
	  	});

	  	analysis.totSpikes = totSpikes;
	  	analysis.analyzable = analyzable;
	    callback(analysis);
	});

}

analyzer.getAllData = function(callback) {

	mongoapi.findPairs(function(docs){
		//console.log(docs);

		if (!docs || docs.length < 1) {
			callback(response);
			return;
		}

		docs.code = 200;

		docs.forEach( function(doc) {
			doc.analysis = analyzer.getMarketAnalysis(doc);
		});

		callback(docs);

	});
}


analyzer.getPairData = function(pair, callback) {
	mongoapi.findPair(pair, function(market){
		if (!market || !market.spikes)
			callback(response);
		else {
			market.analysis = analyzer.getMarketAnalysis(market);
			market.code = 200;
			callback(market);
		}
	});
}

//COMMON FUNCTIONS
analyzer.aggregateSpikes = function(spikes) {

	const aggregatedSpikes = [];

	let prevspike = spikes[spikes.length - 1].perc;
	let currentspike = 0;

	for (let k = spikes.length - 2; k > -1; k--) {
		
		currentspike = spikes[k].perc;

		if (currentspike == 0) //should never happen now..
			continue;

		if (prevspike*currentspike > 0)
			prevspike += currentspike;
		else if (prevspike*currentspike < 0) {
			aggregatedSpikes.push(prevspike);
			prevspike = currentspike;
		}

	}

	aggregatedSpikes.push(prevspike);
	return aggregatedSpikes;
}

//this fuction doesn't take spikes structure as input, but just the percentages array
analyzer.cleanCurve = function(aSpikes) {

	const cleanSpikes = [];
	cleanSpikes.push(aSpikes[0]);

	for (let k = 1; k < aSpikes.length-1; k++) {
		let prev = aSpikes[k-1];
		let next = aSpikes[k+1];
		let current = aSpikes[k]

		if (current > (prev+next)/4)
			cleanSpikes.push(current);
	}

	cleanSpikes.push(aSpikes[aSpikes.length-1]);

	return cleanSpikes;
}

// *** IMPLEMENTED RANKING ALGORITHMS ***

//V1.4
analyzer.getMarketAnalysis = function(market) {

	const spikes = market.spikes;

	let change = 0;
	let highestup = 0;
	let highestdown = 0;
	let targetBuy = 0;
	let prevspike = spikes[spikes.length - 1].perc;
	let currentspike = 0;

	for (let k = spikes.length - 2; k > -1; k--) {
		
		currentspike = spikes[k].perc;

		if (currentspike == 0) //should never happen now..
			continue;

		if (prevspike > highestup) {
			highestup = prevspike;
			targetBuy = spikes[k+1].value;
		}
		if (prevspike < 0 && (prevspike > highestdown || highestdown == 0))
			highestdown = prevspike;

		if (prevspike*currentspike > 0)
			prevspike += currentspike;
		else if (prevspike*currentspike < 0) {
			prevspike = currentspike;
			change++;
		}

	}

	const analysis = {};
	analysis.rank = change;
	analysis.spikes = spikes.length;
	analysis.latestSpike = prevspike;
	analysis.highestUpswing = highestup;
	analysis.highestDownswing = highestdown;
	analysis.targetBuyPerc = -Math.floor(analysis.highestUpswing);
	analysis.targetBuy = targetBuy*(100-Math.floor(analysis.highestUpswing))/100;
	analysis.targetSell = spikes[0].value*(100+Math.floor(-1*analysis.highestDownswing))/100;
	analysis.buyable = analysis.rank >= config.ALERTRANK;
	return analysis;
}

//V1.3
/*analyzer.getMarketAnalysis = function(market) {

	const spikes = market.spikes;

	let change = 0;
	let up = 0;
	let down = 0;
	let spikeValues = spikes[0].perc;
	let rank = 0;
	let chainspike = 0;

	for (let k = spikes.length - 1; k > 0; k--) {
		if (spikes[k].perc == 0)
			continue;
		spikeValues += spikes[k-1].perc;
		if (spikes[k].perc*spikes[k-1].perc < 0) {
			chainspike = 0;
			change++;
			if (spikes[k].perc < 0)
				rank++;
		} else if(spikes[k].perc > 0) {
			up += chainspike+1;
			chainspike = 1;
		} else {
			down += chainspike+1;
			chainspike = 1;
		}
	}

	rank -= down;

	const analysis = {};
	analysis.rank = rank;
	analysis.ratiorank = spikes.length > 1 ? change/(spikes.length-1) : 0;
	analysis.switch = change;
	analysis.upswing = up;
	analysis.downswing = down;
	analysis.spikes = spikes.length;
	analysis.spikeValues = spikeValues;
	analysis.buyable = analysis.rank >= config.ALERTRANK && analysis.spikes > config.MIN_SPIKES && analysis.ratiorank > config.ALERTRATIO;
	return analysis;
}
*/

//V1.2
/*analyzer.getMarketAnalysis = function(market) {

	const spikes = market.spikes;

	let change = 0;
	let up = 0;
	let down = 0;
	let spikeValues = spikes[0].perc;

	for (let k = 0; k < spikes.length - 1; k++) {
		if (spikes[k].perc == 0)
			continue;
		spikeValues += spikes[k+1].perc;
		if (spikes[k].perc*spikes[k+1].perc < 0)
			change++;
		else if(spikes[k].perc > 0)
			up++;
		else
			down++;
	}

	const analysis = {};
	analysis.rank = change/(spikes.length-1);
	analysis.switch = change;
	analysis.upswing = up;
	analysis.downswing = down;
	analysis.spikes = spikes.length;
	analysis.spikeValues = spikeValues;
	analysis.buyable = analysis.rank > 0.5 && analysis.spikes > 7 && analysis.switch > 3 && analysis.spikeValues > -1.5*config.SPIKE && analysis.spikeValues < 3.5*config.SPIKE;

	return analysis;
}*/

//V1.0
/*analyzer.getMarketAnalysis = function(market) {

	const spikes = market.spikes;

	let good = 0;
	let bad = 0;
	let rank = 0;

	for (let k = 0; k < spikes.length - 1; k++) {
		let prev = spikes[k].perc;
		if (prev >= 0) continue;
		let current = spikes[k+1].perc;
		if (current > 0) 
			good++;
		else 
			bad++;
	}

	const analysis = {};
	analysis.rank = good-bad;
	analysis.upswing = good;
	analysis.downswing = bad;
	analysis.totalSpikes = spikes.length;

	return analysis;
}*/

module.exports = analyzer;