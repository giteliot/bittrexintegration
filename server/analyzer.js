'use strict';

const mongoapi = require('./mongoapi');
const fs = require('fs');

const analyzer = {};

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

module.exports = analyzer;