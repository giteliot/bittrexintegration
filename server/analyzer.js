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

// *** IMPLEMENTED RANKING ALGORITHMS ***

//V1.2
analyzer.getMarketAnalysis = function(market) {

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
	analysis.buyable = analysis.rank > 0.5 && analysis.spikes > 5 && analysis.switch > 2 && analysis.spikeValues > -1*config.SPIKE && analysis.spikeValues < -3*config.SPIKE;

	return analysis;
}

//V1.1
/*
analyzer.getMarketAnalysis = function(market) {

	const spikes = market.spikes;

	let change = 0;
	let up = 0;
	let down = 0;

	for (let k = 0; k < spikes.length - 1; k++) {

		if (spikes[k].perc*spikes[k+1].perc < 0)
			change++;
		else if(spikes[k].perc > 0)
			up++;
		else
			down++;
	}

	const analysis = {};
	analysis.rank = (change*2+up-down)/(spikes.length+1);
	analysis.switch = change;
	analysis.upswing = up;
	analysis.downswing = down;
	analysis.spikes = spikes.length;

	return analysis;
}
*/

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