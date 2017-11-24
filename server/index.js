'use strict';

const app = require('./app');
const mongoapi = require('./mongoapi');
const analyzer = require('./analyzer');
const request = require('request');
const PORT = process.env.PORT || 9000;

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

app.get('/api/v1/data/excel', function(req,res) {

	analyzer.writeSpikesCsv(function(resp) {
	  	  res.status(resp.code);
	  	  res.send(resp.message);
    });

});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});