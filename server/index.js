'use strict';

const app = require('./app');
const mongoapi = require('./mongoapi');
const analyzer = require('./analyzer');
const trader = require('./trader');
const request = require('request');
const PORT = process.env.PORT || 9000;

//*** USEFUL API'S ***

//INIT
//clean the database, reinitiate with all markets on bittrex
app.post('/api/v1/app/init', function(req,res){
	res.status(200).send("Init event sent");
	mongoapi.init();
});

//TRADING

//get gains between two timestamps e.g. /api/v1/trade/gains?s='2017-12-05'&e='2017-12-21'
//parameters are optional, full syntax is 2017-12-04T23:00:00.000Z
app.get('/api/v1/trade/gains' ,function(req,res) {
	const startDate = req.query.s;
	const endDate = req.query.e;

	trader.getGains(function(gains) {
		if (!gains || gains.ethGain == undefined) 
			res.status(501).send("Could not retrieve gains. Please try again later.");
		else
			res.status(200).send(gains);

	}, startDate, endDate);
});

//retrieve all boughts currencies that are not yet sold
app.get('/api/v1/trade/outstanding', function(req,res) {
	trader.getBuys(function(buys) {
		if (!buys) 
			res.status(501).send("Could not retrieve outstanding trades. Please try again later.");
		else
			res.status(200).send(buys);
	});
});

//retrieve all closed transactions between two (optional) dates (timestamps)
app.get('/api/v1/trade/history' ,function(req,res) {
	const startDate = req.query.s;
	const endDate = req.query.e;

	trader.getTransactionHistory(function(transactions) {
		if (!transactions) 
			res.status(501).send("Could not retrieve transaction history. Please try again later.");
		else
			res.status(200).send(transactions);

	}, startDate, endDate);
});

app.get('/api/v1/data/spikes' ,function(req, res) {
	analyzer.getSpikesData(function(analysis){
		if (analysis) {
			res.status(200).send(analysis); 
		} else {
			res.status(501).send("Could not retrieve spikes data. Please try again later.");
		}
	});
});

//*** END USEFUL API'S ***

// PAIR API'S

//get all active pairs
app.post('/api/v1/pairs/addall/:currency' , function(req, res){
	 
	  mongoapi.insertAllPairs(req.params.currency);
	  res.status(200).send("Massive add event sent");         

});

//get all active pairs
app.get('/api/v1/pairs' , function(req, res){
	 
	  mongoapi.findPairs(function(docs) {
	  	  res.send(docs);         
      });

});

//delete all active pairs
app.delete('/api/v1/pairs' , function(req, res){
	 
	  mongoapi.deletePairs(function(resp) {

	  	  res.status(resp.code);
	  	  res.send(resp.message);
          
      });

});

//add a pair in the active pool
app.post('/api/v1/insert/:pair', function(req,res) {

	mongoapi.insertPair(req.params.pair, function(resp) {
	  	  res.status(resp.code);
	  	  res.send(resp.message);
    });

});

// SPIKES API'S

//only for test purposes
app.post('/api/v1/spike/clean', function(req,res) {

	mongoapi.cleanSpikes();
	res.status(200).send("Clean spikes event sent");

});

//only for test purposes
app.post('/api/v1/spike/:pair', function(req,res) {

	mongoapi.insertSpike(req.params.pair, 15, 0.00123,function(resp) {
	  	  res.status(resp.code);
	  	  res.send(resp.message);
    });

});

// DATA ANALYSIS API'S

//get all data for a speciifc pair
app.get('/api/v1/data/analyzepair/:pair', function(req,res) {

	analyzer.getPairData(req.params.pair, function(market) {
	  	  res.status(market.code);
	  	  res.send(market);
    });

});

//get all data of every market (pair)
app.get('/api/v1/data/analyze', function(req,res) {

	analyzer.getAllData(function(markets) {
	  	  res.status(markets.code);
	  	  res.send(markets);
    });

});

//write all data in an csv file
app.get('/api/v1/data/excel', function(req,res) {

	analyzer.writeSpikesCsv(function(resp) {
	  	  res.status(resp.code);
	  	  res.send(resp.message);
    });

});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});